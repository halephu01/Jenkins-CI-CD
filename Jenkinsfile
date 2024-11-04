pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = "SonarQube"
    }

    stages {
        stage('Clone') {
            steps {
                git url: 'https://github.com/halephu01/Jenkins-CI-CD.git', branch: 'main'
            }
        }

        stage('Code Quality Analysis') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        sh 'sonar-scanner'
                    }
                }
            }
        }

        stage('Docker Compose Up') {
            steps {
                script {
                    sh 'docker compose up '
                }
            }
        }

        stage('Run Microservices') {
            steps {
                // Danh sách các services
                script {
                    def services = ['api-gateway', 'identity-service', 'notification-service', 'order-service', 'product-service', 'inventory-service'] 
                    services.each { service ->
                        dir(service) {
                            sh 'mvn spring-boot:run'
                        }
                    }
                }
            }
        }

        stage('Setup Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm start'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
