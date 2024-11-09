pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_NETWORK = 'amibi-network'
        GITHUB_REPO = 'https://github.com/halephu01/Jenkins-CI-CD.git'
        BRANCH = 'main'
    }

    stages {
        stage('Check Environment') {
            steps {
                script {
                    try {
                        sh '''
                            echo "Checking environment..."
                            docker --version
                            docker-compose --version
                            node --version
                            npm --version
                            whoami
                            groups
                            
                            # Kiểm tra quyền Docker
                            docker ps
                        '''
                    } catch (Exception e) {
                        error "Environment check failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    try {
                        cleanWs()
                        
                        git branch: "${BRANCH}",
                            url: "${GITHUB_REPO}"
                        
                        sh '''
                            echo "Checked out branch: ${BRANCH}"
                            echo "Current directory content:"
                            ls -la
                        '''
                    } catch (Exception e) {
                        error "Checkout failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    try {
                        sh '''
                            # Kiểm tra Docker daemon
                            docker info
                            
                            # Dừng và xóa containers cũ
                            docker compose down --remove-orphans || true
                            
                            # Cleanup networks
                            docker network prune -f
                            
                            # Tạo network mới nếu chưa tồn tại
                            docker network inspect ${DOCKER_NETWORK} >/dev/null 2>&1 || \
                            docker network create ${DOCKER_NETWORK}
                            
                            # Build và start services
                            DOCKER_NETWORK=${DOCKER_NETWORK} COMPOSE_HTTP_TIMEOUT=200 docker compose up -d --build
                            
                            # Kiểm tra trạng thái
                            docker compose ps
                            docker compose logs
                        '''
                    } catch (Exception e) {
                        sh 'docker compose logs'
                        error "Docker Compose failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Deploy Microservices') {
            steps {
                script {
                    try {
                        sh '''
                            # Login to Docker Hub
                            echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                            
                            # Function để pull và run container
                            deploy_service() {
                                local name=$1
                                local port=$2
                                echo "Deploying ${name}..."
                                docker pull 4miby/${name}:latest
                                docker run -d --name ${name} \
                                    --network ${DOCKER_NETWORK} \
                                    -p ${port}:${port} \
                                    4miby/${name}:latest
                            }
                            
                            # Deploy các services
                            deploy_service "api-gateway" "9000"
                            deploy_service "product-service" "8080"
                            deploy_service "order-service" "8081"
                            deploy_service "inventory-service" "8082"
                            deploy_service "notification-service" "8083"
                            deploy_service "identity-service" "8087"
                            
                            # Kiểm tra trạng thái
                            docker ps -a
                        '''
                    } catch (Exception e) {
                        error "Failed to deploy microservices: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Setup Frontend') {
            steps {
                script {
                    try {
                        sh '''
                            # Kiểm tra Node.js
                            echo "Node version: $(node --version)"
                            echo "NPM version: $(npm --version)"
                            
                            # Di chuyển vào thư mục frontend
                            cd frontend
                            echo "Current directory: $(pwd)"
                            ls -la
                            
                            # Cài đặt dependencies
                            echo "Installing dependencies..."
                            npm install
                            
                            # Build ứng dụng (nếu cần)
                            echo "Building application..."
                            npm run build
                            
                            # Chạy ứng dụng
                            echo "Starting frontend application..."
                            nohup npm start > frontend.log 2>&1 &
                            
                            # Đợi ứng dụng khởi động
                            sleep 30
                            
                            # Kiểm tra process
                            ps aux | grep npm
                            cat frontend.log
                        '''
                    } catch (Exception e) {
                        error "Frontend setup failed: ${e.getMessage()}"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        
        success {
            echo 'Pipeline completed successfully!'
        }
        
        failure {
            script {
                sh '''
                    echo "Deployment failed! Collecting logs..."
                    mkdir -p logs
                    docker compose logs > logs/docker-compose.log
                    docker ps -a > logs/containers.log
                    docker network ls > logs/networks.log
                    tar czf logs.tar.gz logs/
                '''
                archiveArtifacts artifacts: 'logs.tar.gz', allowEmptyArchive: true
            }
        }
    }
} 