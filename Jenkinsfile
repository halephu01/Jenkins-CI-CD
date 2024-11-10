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
                            
                            # Cài đặt Maven nếu chưa có
                            if ! command -v mvn &> /dev/null; then
                                echo "Installing Maven..."
                                apt-get update
                                apt-get install -y maven
                            fi
                            
                            # Kiểm tra phiên bản các công cụ
                            docker --version
                            docker-compose --version
                            node --version
                            npm --version
                            mvn -version
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
                            # Di chuyển đến api-gateway và chạy
                            echo "Deploying api-gateway..."
                            cd api-gateway
                            mvn spring-boot:run &
                            cd ..

                            # Di chuyển đến identity-service và chạy
                            echo "Deploying identity-service..."
                            cd identity-service
                            mvn spring-boot:run &
                            cd ..

                            # Di chuyển đến inventory-service và chạy
                            echo "Deploying inventory-service..."
                            cd inventory-service
                            mvn spring-boot:run &
                            cd ..

                            # Di chuyển đến notification-service và chạy
                            echo "Deploying notification-service..."
                            cd notification-service
                            mvn spring-boot:run &
                            cd ..

                            # Di chuyển đến order-service và chạy
                            echo "Deploying order-service..."
                            cd order-service
                            mvn spring-boot:run &
                            cd ..

                            # Di chuyển đến product-service và chạy
                            echo "Deploying product-service..."
                            cd product-service
                            mvn spring-boot:run &
                            cd ..

                            # Kiểm tra các processes đang chạy
                            ps aux | grep spring-boot
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