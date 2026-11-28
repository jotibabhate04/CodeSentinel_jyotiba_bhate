
pipeline {
    agent any

    triggers {
        githubPush()
    }

    options {
        timeout(time: 45, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
        timestamps()
    }

    environment {
        COMPOSE_PROJECT_NAME = 'codesentinel_jyotiba_bhate'
        DB_NAME              = 'codesentinel_db'
        DB_USER              = 'codesentinel_user'
        DB_ROOT_PASSWORD     = credentials('codesentinel-db-root-password')
        DB_PASSWORD          = credentials('codesentinel-db-password')
        JWT_SECRET           = credentials('codesentinel-jwt-secret')
        JWT_EXPIRES_IN       = '24h'
    }

    stages {

        stage('Git Checkout') {
            steps {
                checkout scm
                sh 'git rev-parse --short HEAD'
            }
        }

        stage('Backend Dependency Installation') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend Dependency Installation') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Backend Tests & Coverage') {
            steps {
                dir('backend') {
                    sh '''
                        set -eu

                        echo "Preparing isolated backend coverage database..."

                        MYSQL_HOST=$(docker inspect \
                          -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' \
                          codesentinel-mysql)

                        if [ -z "$MYSQL_HOST" ]; then
                            echo "MySQL container IP not found."
                            exit 1
                        fi

                        docker exec \
                          -e MYSQL_PWD="$DB_ROOT_PASSWORD" \
                          codesentinel-mysql \
                          mysql -uroot -e "
                            CREATE DATABASE IF NOT EXISTS codesentinel_coverage;
                            GRANT ALL PRIVILEGES ON codesentinel_coverage.* TO '${DB_USER}'@'%';
                          "

                        export DB_HOST="$MYSQL_HOST"
                        export DB_NAME="codesentinel_coverage"
                        export DB_PORT="3306"
                        export PORT="5001"
                        export NODE_ENV="test"
                        export BASE_URL="http://127.0.0.1:5001/api"

                        rm -rf coverage .nyc_output

                        echo "Starting backend with c8 coverage..."

                        ./node_modules/.bin/c8 \
                          --all \
                          --src src \
                          --reporter=text \
                          --reporter=lcov \
                          --reports-dir=coverage \
                          node src/server.js \
                          > "$WORKSPACE/backend-coverage-server.log" 2>&1 &

                        COVERAGE_PID=$!

                        cleanup() {
                            echo "Cleaning up Jenkins coverage process..."

                            if kill -0 "$COVERAGE_PID" 2>/dev/null; then
                                SERVER_PID=$(pgrep -P "$COVERAGE_PID" | head -n 1 || true)

                                if [ -n "$SERVER_PID" ]; then
                                    kill -TERM "$SERVER_PID" 2>/dev/null || true
                                fi

                                wait "$COVERAGE_PID" 2>/dev/null || true
                            fi
                        }

                        trap cleanup EXIT

                        READY=0

                        echo "Waiting for backend startup..."

                        for i in $(seq 1 40); do
                            if curl -fsS "$BASE_URL/health" >/dev/null 2>&1; then
                                READY=1
                                break
                            fi

                            sleep 1
                        done

                        if [ "$READY" -ne 1 ]; then
                            echo "Backend startup failed:"
                            cat "$WORKSPACE/backend-coverage-server.log"
                            exit 1
                        fi

                        echo "Backend started successfully."

                        echo "Running 23 backend integration tests..."

                        node test_api.js

                        echo "Stopping Jenkins coverage backend..."

                        SERVER_PID=$(pgrep -P "$COVERAGE_PID" | head -n 1 || true)

                        if [ -n "$SERVER_PID" ]; then
                            kill -TERM "$SERVER_PID" 2>/dev/null || true
                        fi

                        wait "$COVERAGE_PID"
                        trap - EXIT

                        echo "Generating backend coverage report..."

                        ./node_modules/.bin/c8 report \
                          --reporter=text \
                          --reporter=lcov \
                          --reports-dir=coverage

                        if [ ! -s coverage/lcov.info ]; then
                            echo "Backend LCOV report is missing or empty."
                            exit 1
                        fi

                        echo "Backend coverage report generated successfully."
                    '''
                }
            }
        }

        stage('Frontend Tests & Coverage') {
            steps {
                dir('frontend') {
                    sh '''
                        set -eu

                        echo "Running frontend tests with coverage..."

                        rm -rf coverage

                        npm run coverage

                        if [ ! -s coverage/lcov.info ]; then
                            echo "Frontend LCOV report is missing or empty."
                            exit 1
                        fi

                        echo "Frontend coverage report generated successfully."
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'

                        withEnv(["PATH+SONAR_SCANNER=${scannerHome}/bin"]) {
                            sh '''
                                set -eu

                                echo "Verifying backend and frontend coverage reports..."

                                test -s backend/coverage/lcov.info
                                test -s frontend/coverage/lcov.info

                                echo "Starting SonarQube analysis..."

                                sonar-scanner \
                                  -Dsonar.projectBaseDir="$WORKSPACE"
                            '''
                        }
                    }
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    sh 'VITE_API_BASE_URL=/api npm run build'
                }
            }
        }

        stage('Docker Image Build') {
            steps {
                sh 'docker compose build --no-cache'
            }
        }

        stage('Trivy Security Scan') {
            steps {
                sh '''
                    set -eu

                    echo "======================================"
                    echo "TRIVY BACKEND IMAGE SECURITY SCAN"
                    echo "======================================"

                    trivy image \
                      --scanners vuln \
                      --exit-code 1 \
                      --severity CRITICAL,HIGH \
                      codesentinel-backend:latest

                    echo "Backend image scan passed."

                    echo "======================================"
                    echo "TRIVY FRONTEND IMAGE SECURITY SCAN"
                    echo "======================================"

                    trivy image \
                      --scanners vuln \
                      --exit-code 1 \
                      --severity CRITICAL,HIGH \
                      codesentinel-frontend:latest

                    echo "Frontend image scan passed."

                    echo "All Docker image security scans passed."
                '''
            }
        }

        stage('Docker Compose Deployment') {
            steps {
                sh '''
                    set -eu

                    TOKEN=$(curl -s -X PUT \
                      "http://169.254.169.254/latest/api/token" \
                      -H "X-aws-ec2-metadata-token-ttl-seconds: 60" || true)

                    if [ -n "$TOKEN" ]; then
                        EC2_IP=$(curl -s \
                          -H "X-aws-ec2-metadata-token: $TOKEN" \
                          http://169.254.169.254/latest/meta-data/public-ipv4 || true)
                    else
                        EC2_IP=$(curl -s --connect-timeout 2 \
                          http://169.254.169.254/latest/meta-data/public-ipv4 || true)
                    fi

                    if [ -n "$EC2_IP" ]; then
                        export ALLOWED_ORIGINS="http://localhost,http://localhost:80,http://${EC2_IP}"
                    else
                        export ALLOWED_ORIGINS="http://localhost,http://localhost:80"
                    fi

                    docker compose up -d --remove-orphans
                '''
            }
        }

        stage('Application Health Verification') {
            steps {
                sh '''
                    set -eu

                    echo "Waiting for application services..."

                    for i in $(seq 1 24); do
                        if curl -fsS http://localhost/ >/dev/null 2>&1; then
                            break
                        fi

                        echo "Waiting for frontend ($i/24)..."
                        sleep 5
                    done

                    echo "Checking Docker containers..."

                    docker compose ps

                    echo "Verifying frontend..."

                    curl -fsS -o /dev/null \
                      -w "Frontend HTTP Status: %{http_code}\\n" \
                      http://localhost/

                    echo "Verifying backend API..."

                    curl -fsS http://localhost/api/health

                    echo ""
                    echo "Application health verification completed."
                '''
            }
        }
    }

    post {
        success {
            echo 'CodeSentinel CI/CD pipeline succeeded and application is live.'
        }

        failure {
            echo 'CodeSentinel CI/CD pipeline failed. Check stage logs.'
            sh 'docker compose logs --tail=50 || true'
        }

        always {
            sh 'docker image prune -f || true'
        }
    }
}
