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
                git 'https://github.com/halephu01/Jenkins-CI-CD.git'
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    sh "echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin"
                }
            }
        }

        stage('Run Docker Compose') {
            steps {
                script {
                    sh 'docker-compose down || true'
                    
                    sh 'docker-compose up -d'
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
                    '''
                    
                    sh '''
                        # Pull images
                        docker pull 4miby/api-gateway
                        docker pull 4miby/notification-service
                        docker pull 4miby/inventory-service
                        docker pull 4miby/order-service
                        docker pull 4miby/identity-service
                        docker pull 4miby/product-service

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
                        npm install
                        npm start 
                    '''
                }
            }
        }

    }

    post {
        always {
            sh 'docker logout'
        }
        failure {
            sh '''
                docker-compose down
                docker rm -f api-gateway || true
                docker rm -f notification-service || true
                docker rm -f inventory-service || true
                docker rm -f order-service || true
                docker rm -f identity-service || true
                docker rm -f product-service || true
            '''
        }
    }
}
