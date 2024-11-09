pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_NETWORK = 'amibi-network'
        GITHUB_REPO = 'https://github.com/halephu01/Jenkins-CI-CD.git'
        BRANCH = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                
                git branch: "${BRANCH}",
                    url: "${GITHUB_REPO}"
                
                sh '''
                    echo "Checked out branch: ${BRANCH}"
                    echo "Current directory content:"
                    ls -la
                '''
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    try {
                        sh '''
                            # Dừng và xóa các containers cũ nếu có
                            docker compose down --remove-orphans || true
                            
                            # Xóa network cũ nếu có
                            docker network rm ${DOCKER_NETWORK} || true
                            
                            # Tạo network mới
                            docker network create ${DOCKER_NETWORK} || true
                            
                            # Chạy docker compose
                            DOCKER_NETWORK=${DOCKER_NETWORK} docker compose up -d
                            
                            # Hiển thị trạng thái các containers
                            docker compose ps
                        '''
                    } catch (Exception e) {
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
                            
                            # Pull và chạy các services
                            # API Gateway
                            docker pull 4miby/api-gateway:latest
                            docker run -d --name api-gateway \
                                --network ${DOCKER_NETWORK} \
                                -p 9000:9000 \
                                4miby/api-gateway:latest

                            # Product Service
                            docker pull 4miby/product-service:latest
                            docker run -d --name product-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8080:8080 \
                                4miby/product-service:latest

                            # Order Service
                            docker pull 4miby/order-service:latest
                            docker run -d --name order-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8081:8081 \
                                4miby/order-service:latest

                            # Inventory Service
                            docker pull 4miby/inventory-service:latest
                            docker run -d --name inventory-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8082:8082 \
                                4miby/inventory-service:latest

                            # Notification Service
                            docker pull 4miby/notification-service:latest
                            docker run -d --name notification-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8083:8083 \
                                4miby/notification-service:latest

                            # Identity Service
                            docker pull 4miby/identity-service:latest
                            docker run -d --name identity-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8087:8087 \
                                4miby/identity-service:latest

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
                            echo "Checking Node.js installation..."
                            if ! command -v node &> /dev/null; then
                                echo "Installing Node.js..."
                                curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                                apt-get install -y nodejs
                            fi
                            
                            # Di chuyển vào thư mục frontend
                            cd frontend
                            
                            # Hiển thị thư mục hiện tại
                            echo "Current directory: $(pwd)"
                            ls -la
                            
                            # Cài đặt dependencies
                            echo "Installing dependencies..."
                            npm install
                            
                            # Chạy ứng dụng
                            echo "Starting frontend application..."
                            npm start &
                            
                            # Đợi frontend khởi động
                            echo "Waiting for frontend to start..."
                            sleep 30
                            
                            # Kiểm tra process
                            ps aux | grep npm
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
        
        failure {
            script {
                sh '''
                    echo "Deployment failed! Collecting logs..."
                    docker compose logs > docker-compose.log
                    tar czf logs.tar.gz docker-compose.log frontend/npm-debug.log* || true
                '''
                archiveArtifacts artifacts: 'logs.tar.gz', allowEmptyArchive: true
            }
        }
    }
} 