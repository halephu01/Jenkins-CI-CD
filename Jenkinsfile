pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'halephu01'
        DOCKERHUB_PASS = credentials('Halephu0!234')
        NETWORK_NAME = 'my-network'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    try {
                        git branch:'main', url: 'https://github.com/halephu01/Jenkins-CI-CD.git'
                        sh '''
                            echo "Current directory contents:"
                            ls -la
                            echo "Git status:"
                            git status
                        '''
                    } catch (Exception e) {
                        echo "Error in Clone Repository stage: ${e.getMessage()}"
                        error("Clone Repository stage failed")
                    }
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    try {
                        sh '''
                            echo "Checking Docker installation:"
                            docker --version
                            echo "Attempting Docker login..."
                            echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin
                            echo "Docker info:"
                            docker info
                        '''
                    } catch (Exception e) {
                        echo "Error in Docker Login stage: ${e.getMessage()}"
                        error("Docker Login stage failed")
                    }
                }
            }
        }

        stage('Check Environment') {
            steps {
                script {
                    sh '''
                        echo "Workspace directory:"
                        pwd
                        echo "System information:"
                        uname -a
                        echo "Docker version:"
                        docker --version
                        echo "Docker Compose version:"
                        docker-compose --version
                        echo "Node version:"
                        node -v || echo "Node.js not installed"
                        echo "NPM version:"
                        npm -v || echo "NPM not installed"
                    '''
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d'
                    sh 'docker-compose ps'
                    sh 'docker network ls'
                }
            }
        }

        stage('Pull and Run Services') {
            steps {
                script {
                    sh '''
                        docker rm -f api-gateway || true
                        docker rm -f notification-service || true
                        docker rm -f inventory-service || true
                        docker rm -f order-service || true
                        docker rm -f identity-service || true
                        docker rm -f product-service || true
                        docker rm -f inventory-service || true
                        docker rm -f api-gateway || true
                        docker rm -f notification-service || true
                        
                        # Pull images
                        docker pull 4miby/api-gateway
                        docker pull 4miby/notification-service
                        docker pull 4miby/inventory-service
                        docker pull 4miby/order-service
                        docker pull 4miby/identity-service
                        docker pull 4miby/product-service
                        
                        # Verify images were pulled
                        docker images | grep 4miby
                        
                        # Run containers
                        docker run -d --name api-gateway \
                            --network app-network \
                            -p 9000:9000 \
                            4miby/api-gateway

                        docker run -d --name notification-service \
                            --network app-network \
                            -p 8083:8083 \
                            4miby/notification-service

                        docker run -d --name inventory-service \
                            --network app-network \
                            -p 8082:8082 \
                            4miby/inventory-service

                        docker run -d --name order-service \
                            --network app-network \
                            -p 8081:8081 \
                            4miby/order-service

                        docker run -d --name identity-service \
                            --network app-network \
                            -p 8087:8087 \
                            4miby/identity-service

                        docker run -d --name product-service \
                            --network app-network \
                            -p 8080:8080 \
                            4miby/product-service
                        
                        # Verify containers are running
                        docker ps --format "{{.Names}}: {{.Status}}"
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh 'docker ps'
                    sh 'docker-compose ps'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    sh '''
                        cd frontend
                        pwd
                        ls -la
                        npm -v
                        node -v
                        npm install
                        npm start &
                        sleep 10
                        curl -s http://localhost:3000 || echo "Frontend chưa sẵn sàng"
                    '''
                }
            }
        }

    }

    post {
        always {
            echo "Pipeline completed - Cleaning up..."
            sh 'docker logout || true'
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed! Check the logs above for details."
            sh '''
                echo "Cleaning up containers..."
                docker-compose down || true
                docker rm -f api-gateway notification-service inventory-service order-service identity-service product-service || true
            '''
        }
    }
}
