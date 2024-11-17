pipeline {
    agent any
    
    tools {
        maven 'Maven 3.9.6' 
        jdk 'JDK 21'      
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
    
        stage('Deploy') {
            steps {
                script {
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
    }
}


