pipeline {
    agent any
    
    tools {
        maven 'Maven 3.9.6'  // Tên phải khớp với tên đã cấu hình trong Jenkins
        jdk 'JDK 17'         // Nếu cần JDK, thêm dòng này và cấu hình JDK trong Tools
    }
    
    environment {
        GITHUB_CREDENTIALS = credentials('github-credentials')  // Thêm credentials cho GitHub
        GITHUB_REPO_URL = 'https://github.com/halephu01/Jenkins-CI-CD.git'  // URL repo của bạn
        BRANCH_NAME = 'main'  // Tên nhánh muốn pull
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Xóa workspace cũ nếu tồn tại
                cleanWs()
                
                // Clone với credentials
                git branch: "${BRANCH_NAME}",
                    credentialsId: 'github-credentials',
                    url: "${GITHUB_REPO_URL}"
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
