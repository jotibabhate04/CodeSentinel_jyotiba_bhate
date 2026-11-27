
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

                        echo "Starting instrumented backend..."

                        npx c8 \
                          --all \
                          --src src \
                          --reporter=text \
                          --reporter=lcov \
                          --reports-dir=coverage \
                          node src/server.js \
                          > "$WORKSPACE/backend-coverage-server.log" 2>&1 &

                        SERVER_PID=$!

                        cleanup() {
                            kill -TERM "$SERVER_PID" 2>/dev/null || true
                            wait "$SERVER_PID" 2>/dev/null || true
                        }

                        trap cleanup EXIT

                        READY=0

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

                        echo "Running backend integration tests..."
                        node test_api.js

                        echo "Stopping instrumented backend..."
                        kill -TERM "$SERVER_PID" 2>/dev/null || true
                        wait "$SERVER_PID" || true
                        trap - EXIT

                        echo "Generating backend coverage report..."
                        npx c8 report \
                          --reporter=text \
                          --reporter=lcov \
                          --reports-dir=coverage

                        test -s coverage/lcov.info
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

                        test -s coverage/lcov.info
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
                                echo "Verifying coverage reports..."

                                test -s backend/coverage/lcov.info
                                test -s frontend/coverage/lcov.info

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

        stage('Docker Compose Deployment') {
            steps {
                sh '''
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
                    echo "Waiting for containers to pass Docker health checks..."

                    for i in $(seq 1 24); do
                        HEALTHY_COUNT=$(docker compose ps --format json 2>/dev/null | grep -c '"Health":"healthy"' || true)

                        if [ "$HEALTHY_COUNT" -ge 3 ]; then
                            echo "All 3 services are healthy."
                            break
                        fi

                        echo "Waiting for services to become healthy ($i/24)..."
                        sleep 5
                    done

                    docker compose ps

                    echo "Verifying Frontend (NGINX)..."
                    curl -fsS -o /dev/null \
                      -w "Frontend HTTP Status: %{http_code}\\n" \
                      http://localhost/

                    echo "Verifying Backend API through NGINX Proxy..."
                    curl -fsS http://localhost/api/health
                    echo ""
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
