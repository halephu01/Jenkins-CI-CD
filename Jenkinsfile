pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        
        USER_SERVICE_IMAGE = 'halephu01/user-service'
        FRIEND_SERVICE_IMAGE = 'halephu01/friend-service'
        AGGREGATE_SERVICE_IMAGE = 'halephu01/aggregate-service'
        
        VERSION = "${BUILD_NUMBER}"
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

        stage('Build Docker Images') {
            steps {
                script {
                    dir('user-service') {
                        docker.build("${USER_SERVICE_IMAGE}:${VERSION}")
                    }
                    
                    dir('friend-service') {
                        docker.build("${FRIEND_SERVICE_IMAGE}:${VERSION}")
                    }
                    
                    dir('aggregate-service') {
                        docker.build("${AGGREGATE_SERVICE_IMAGE}:${VERSION}")
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
                    sh "docker push ${USER_SERVICE_IMAGE}:${VERSION}"
                    sh "docker tag ${USER_SERVICE_IMAGE}:${VERSION} ${USER_SERVICE_IMAGE}:latest"
                    sh "docker push ${USER_SERVICE_IMAGE}:latest"
                    
                    sh "docker push ${FRIEND_SERVICE_IMAGE}:${VERSION}"
                    sh "docker tag ${FRIEND_SERVICE_IMAGE}:${VERSION} ${FRIEND_SERVICE_IMAGE}:latest"
                    sh "docker push ${FRIEND_SERVICE_IMAGE}:latest"
                    
                    sh "docker push ${AGGREGATE_SERVICE_IMAGE}:${VERSION}"
                    sh "docker tag ${AGGREGATE_SERVICE_IMAGE}:${VERSION} ${AGGREGATE_SERVICE_IMAGE}:latest"
                    sh "docker push ${AGGREGATE_SERVICE_IMAGE}:latest"
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
        always {
            sh 'docker logout'
            
            script {
                sh """
                    docker rmi ${USER_SERVICE_IMAGE}:${VERSION} || true
                    docker rmi ${FRIEND_SERVICE_IMAGE}:${VERSION} || true
                    docker rmi ${AGGREGATE_SERVICE_IMAGE}:${VERSION} || true
                """
            }
        }
        
        success {
            slackSend(
                color: 'good',
                message: "Build #${BUILD_NUMBER} - Success\nAll services deployed successfully"
            )
        }
        
        failure {
            slackSend(
                color: 'danger',
                message: "Build #${BUILD_NUMBER} - Failed\nCheck console output at ${BUILD_URL}"
            )
        }
    }
} 