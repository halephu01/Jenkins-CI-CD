pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8.6'  // Đảm bảo Maven đã được cấu hình trong Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        
        stage('Docker Build & Push') {
            environment {
                DOCKER_CREDENTIALS = credentials('docker-credentials') // Cấu hình credentials trong Jenkins
            }
            steps {
                script {
                    // Đăng nhập vào Docker registry
                    sh 'echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin'
                    
                    // Build và push các image Docker
                    sh 'docker-compose build'
                    sh 'docker-compose push'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // Triển khai ứng dụng sử dụng docker-compose
                    sh 'docker-compose up -d'
                }
            }
        }
    }
    
    post {
        always {
            // Dọn dẹp workspace
            cleanWs()
            // Đăng xuất khỏi Docker registry
            sh 'docker logout'
        }
        
        success {
            echo 'Pipeline executed successfully!'
        }
        
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}
