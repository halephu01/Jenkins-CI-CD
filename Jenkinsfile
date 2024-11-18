pipeline {
    agent any
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/halephu01/Jenkins-CI-CD.git'
            }
        }

        stage('Build Services') {
            steps {
                script {
                    // Build các microservices bằng Docker Compose
                    sh 'docker-compose build'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    // Kiểm tra các dịch vụ
                    sh 'docker-compose up -d'
                }
            }
        }

        // stage('Push Docker Images') {
        //     steps {
        //         script {
        //             // Push Docker images lên Docker Hub hoặc registry
        //             sh 'docker-compose push'
        //         }
        //     }
        // }

        stage('Deploy to Staging') {
            steps {
                script {
                    // Deploy ứng dụng lên môi trường staging
                    sh 'docker-compose -f docker-compose.yml up -d'
                }
            }
        }

        stage('Clean Up') {
            steps {
                script {
                    // Dọn dẹp containers sau khi deploy
                    sh 'docker-compose down'
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline Finished!'
        }
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Deployment Failed!'
        }
    }
}
