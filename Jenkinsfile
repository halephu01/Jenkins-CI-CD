pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        
        USER_SERVICE_IMAGE = 'halephu01/user-service'
        FRIEND_SERVICE_IMAGE = 'halephu01/friend-service'
        AGGREGATE_SERVICE_IMAGE = 'halephu01/aggregate-service'
        
        VERSION = "${BUILD_NUMBER}"
            
        USER_SERVICE = 'user-service'
        FRIEND_SERVICE = 'friend-service'
        AGGREGATE_SERVICE = 'aggregate-service'
    }
    
    tools {
        maven 'Maven 3.8.6'
        jdk 'JDK 11'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/halephu01/Jenkins-CI-CD.git',
                    credentialsId: 'github-credentials'
            }
        }

        stage('Build Services') {
            parallel {
                stage('Build User Service') {
                    steps {
                        dir('user-service') {
                            sh 'mvn clean package -DskipTests'
                        }
                    }
                }
                
                stage('Build Friend Service') {
                    steps {
                        dir('friend-service') {
                            sh 'mvn clean package -DskipTests'
                        }
                    }
                }
                
                stage('Build Aggregate Service') {
                    steps {
                        dir('aggregate-service') {
                            sh 'mvn clean package -DskipTests'
                        }
                    }
                }
            }
        }
        
        stage('Test Services') {
            parallel {
                stage('Test User Service') {
                    steps {
                        dir('user-service') {
                            sh 'mvn test'
                        }
                    }
                    post {
                        always {
                            junit '**/target/surefire-reports/*.xml'
                        }
                    }
                }
                
                stage('Test Friend Service') {
                    steps {
                        dir('friend-service') {
                            sh 'mvn test'
                        }
                    }
                    post {
                        always {
                            junit '**/target/surefire-reports/*.xml'
                        }
                    }
                }
                
                stage('Test Aggregate Service') {
                    steps {
                        dir('aggregate-service') {
                            sh 'mvn test'
                        }
                    }
                    post {
                        always {
                            junit '**/target/surefire-reports/*.xml'
                        }
                    }
                }
            }
        }

        stage('Build and Push Docker Images') {
            steps {
                script {
                    def serviceList = [
                        env.USER_SERVICE,
                        env.FRIEND_SERVICE,
                        env.AGGREGATE_SERVICE
                    ]
                    
                    // Xử lý từng service
                    serviceList.each { service ->
                        try {
                            dir(service) {
                                echo "Building ${service} Docker image..."
                                def imageName = "${env.USER_SERVICE_IMAGE}:${BUILD_NUMBER}"
                                
                                // Build image
                                sh """
                                    docker build -t ${imageName} . -f ${service}/Dockerfile || {
                                        echo "Failed to build ${service} image"
                                        exit 1
                                    }
                                """
                                
                                // Push image if build successful
                                echo "Pushing ${service} Docker image..."
                                sh "docker push ${imageName}"
                            }
                        } catch (Exception e) {
                            echo "Error processing ${service}: ${e.message}"
                            throw e
                        }
                    }
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    // Check if images exist before pushing
                    sh """
                        if docker image inspect halephu01/user-service:${BUILD_NUMBER} >/dev/null 2>&1; then
                            echo "Pushing user-service image..."
                            docker push halephu01/user-service:${BUILD_NUMBER}
                        else
                            echo "user-service image not found!"
                            exit 1
                        fi

                        if docker image inspect halephu01/friend-service:${BUILD_NUMBER} >/dev/null 2>&1; then
                            echo "Pushing friend-service image..."
                            docker push halephu01/friend-service:${BUILD_NUMBER}
                        else
                            echo "friend-service image not found!"
                            exit 1
                        fi

                        if docker image inspect halephu01/aggregate-service:${BUILD_NUMBER} >/dev/null 2>&1; then
                            echo "Pushing aggregate-service image..."
                            docker push halephu01/aggregate-service:${BUILD_NUMBER}
                        else
                            echo "aggregate-service image not found!"
                            exit 1
                        fi
                    """
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                script {
                    sh """
                        sed -i 's|image: halephu01/user-service:.*|image: ${USER_SERVICE_IMAGE}:${VERSION}|' docker-compose.yml
                        sed -i 's|image: halephu01/friend-service:.*|image: ${FRIEND_SERVICE_IMAGE}:${VERSION}|' docker-compose.yml
                        sed -i 's|image: halephu01/aggregate-service:.*|image: ${AGGREGATE_SERVICE_IMAGE}:${VERSION}|' docker-compose.yml
                    """

                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
        always {
            script {
                try {
                    // Cleanup
                    sh """
                        docker-compose down || true
                        docker logout
                        
                        # Remove images
                        for service in ${env.DOCKER_IMAGES}; do
                            image="halephu01/\${service}:${BUILD_NUMBER}"
                            if docker image inspect \${image} >/dev/null 2>&1; then
                                echo "Removing image \${image}..."
                                docker rmi \${image} || true
                            fi
                        done
                    """
                } catch (Exception e) {
                    echo "Cleanup failed: ${e.message}"
                }
            }
        }
    }
} 