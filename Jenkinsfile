
pipeline {
    agent any

    triggers {
        // Triggered automatically by GitHub Webhook
        githubPush()
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
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

        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Validating backend JavaScript syntax..."
                        find src -name "*.js" -exec node --check {} +
                        echo "Verifying Express app module..."
                        NODE_ENV=test node -e "require('./src/app'); console.log('Express app loaded successfully');"
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectBaseDir="$WORKSPACE"
                    '''
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
                    TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60" || true)

                    if [ -n "$TOKEN" ]; then
                        EC2_IP=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4 || true)
                    else
                        EC2_IP=$(curl -s --connect-timeout 2 http://169.254.169.254/latest/meta-data/public-ipv4 || true)
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
                    curl -fsS -o /dev/null -w "Frontend HTTP Status: %{http_code}\\n" http://localhost/

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
