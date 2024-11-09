pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_NETWORK = 'amibi-network'
    }

    stages {
        stage('Check Environment') {
            steps {
                script {
                    sh '''
                        echo "Checking Docker..."
                        if ! command -v docker &> /dev/null; then
                            echo "Docker not found. Installing Docker..."
                            curl -fsSL https://get.docker.com -o get-docker.sh
                            sh get-docker.sh
                        fi
                        
                        echo "Checking Docker Compose..."
                        if ! command -v docker-compose &> /dev/null; then
                            echo "Docker Compose not found. Installing Docker Compose..."
                            curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                            chmod +x /usr/local/bin/docker-compose
                        fi
                        
                        # Start Docker daemon if not running (for non-systemd systems)
                        if ! docker info &> /dev/null; then
                            echo "Starting Docker daemon..."
                            dockerd &
                            sleep 10
                        fi
                        
                        # Create Docker network if not exists
                        if ! docker network ls | grep -q "${DOCKER_NETWORK}"; then
                            echo "Creating Docker network..."
                            docker network create ${DOCKER_NETWORK} || true
                        fi
                        
                        echo "Environment check complete"
                    '''
                }
            }
        }

        stage('Prepare Prometheus Config') {
            steps {
                script {
                    sh '''
                        # Tạo thư mục
                        mkdir -p docker/prometheus
                        
                        # Tạo file cấu hình prometheus.yml
                        cat > docker/prometheus/prometheus.yml << 'EOL'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
EOL

                        # Kiểm tra file
                        ls -la docker/prometheus/
                        cat docker/prometheus/prometheus.yml
                        
                        # Đặt quyền
                        chmod 644 docker/prometheus/prometheus.yml
                    '''
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    try {
                        sh '''
                            # Xóa network cũ nếu tồn tại
                            docker network rm amibi-network || true
                            
                            # Tạo network mới
                            docker network create amibi-network || true
                            
                            # Kiểm tra cấu hình Prometheus
                            echo "Checking Prometheus config..."
                            ls -la docker/prometheus/
                            cat docker/prometheus/prometheus.yml
                            
                            # Khởi động services với detach mode
                            docker compose up -d
                        '''
                    } catch (Exception e) {
                        error "Docker Compose failed: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Start Infrastructure Services') {
            steps {
                script {
                    try {
                        sh '''
                            echo "Starting infrastructure services..."
                            docker compose up 
                            
                            echo "Waiting for infrastructure services to be ready..."
                            sleep 30
                            
                            echo "Checking infrastructure services status..."
                            docker compose ps
                        '''
                    } catch (Exception e) {
                        error "Failed to start infrastructure services: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Start Microservices') {
            steps {
                script {
                    try {
                        sh '''
                            echo "Starting microservices..."
                            
                            # Run API Gateway
                            docker run -d --name api-gateway \
                                --network ${DOCKER_NETWORK} \
                                -p 9000:9000 \
                                halephu01/api-gateway:latest

                            # Run Product Service
                            docker run -d --name product-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8080:8080 \
                                halephu01/product-service:latest

                            # Run Order Service
                            docker run -d --name order-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8081:8081 \
                                halephu01/order-service:latest

                            # Run Inventory Service
                            docker run -d --name inventory-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8082:8082 \
                                halephu01/inventory-service:latest

                            # Run Notification Service
                            docker run -d --name notification-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8083:8083 \
                                halephu01/notification-service:latest

                            # Run Identity Service
                            docker run -d --name identity-service \
                                --network ${DOCKER_NETWORK} \
                                -p 8087:8087 \
                                halephu01/identity-service:latest

                            echo "Waiting for microservices to be ready..."
                            sleep 30
                            
                            echo "Checking containers status..."
                            docker ps -a
                            
                            echo "Checking containers logs..."
                            for service in api-gateway product-service order-service inventory-service notification-service identity-service; do
                                echo "Logs for $service:"
                                docker logs $service --tail 50
                            done
                        '''
                    } catch (Exception e) {
                        error "Failed to start microservices: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Setup Frontend') {
            steps {
                script {
                    try {
                        sh '''
                            echo "Checking Node.js and npm..."
                            if ! command -v node &> /dev/null; then
                                echo "Node.js not found. Installing Node.js..."
                                curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                                apt-get install -y nodejs
                            fi
                            
                            echo "Setting up frontend..."
                            cd frontend
                            
                            echo "Installing dependencies..."
                            npm install
                            
                            echo "Building frontend..."
                            npm run build
                            
                            echo "Starting frontend service..."
                            npm start &
                            
                            echo "Waiting for frontend to start..."
                            sleep 10
                            
                            echo "Frontend setup complete"
                        '''
                    } catch (Exception e) {
                        error "Failed to setup frontend: ${e.getMessage()}"
                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    try {
                        sh '''
                            echo "Performing health checks..."
                            
                            # Function for health check with retry
                            check_health() {
                                local url=$1
                                local service=$2
                                local max_attempts=5
                                local wait_time=10
                                
                                for i in $(seq 1 $max_attempts); do
                                    if curl -f "$url" -m 5; then
                                        echo "$service is healthy"
                                        return 0
                                    else
                                        echo "Attempt $i: $service not healthy, waiting ${wait_time}s..."
                                        sleep $wait_time
                                    fi
                                done
                                echo "$service health check failed after $max_attempts attempts"
                                return 1
                            }
                            
                            # Check all services
                            check_health "http://localhost:9000/actuator/health" "API Gateway"
                            check_health "http://localhost:8080/actuator/health" "Product Service"
                            check_health "http://localhost:8081/actuator/health" "Order Service"
                            check_health "http://localhost:8082/actuator/health" "Inventory Service"
                            check_health "http://localhost:8083/actuator/health" "Notification Service"
                            check_health "http://localhost:8087/actuator/health" "Identity Service"
                            check_health "http://localhost:3500" "Frontend"
                            
                            echo "Health checks completed"
                        '''
                    } catch (Exception e) {
                        error "Health checks failed: ${e.getMessage()}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                sh '''
                    echo "Performing cleanup..."
                    pkill -f "npm start" || true
                    docker compose down --remove-orphans || true
                    docker system prune -f || true
                    docker network rm ${DOCKER_NETWORK} || true
                    echo "Cleanup complete"
                '''
            }
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