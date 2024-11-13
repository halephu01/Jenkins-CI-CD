pipeline {
    agent any
    
    tools {
        maven 'Maven 3.9.6' 
        jdk 'JDK 17'      
    }
    
    environment {
        GITHUB_CREDENTIALS = credentials('github-credentials')  
        GITHUB_REPO_URL = 'https://github.com/halephu01/Jenkins-CI-CD.git'  
        BRANCH_NAME = 'main'  
    }

    stages {
        stage('Checkout') {
            steps {
                cleanWs()
                
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
    
        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
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



