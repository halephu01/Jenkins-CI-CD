pipeline {
    agent {
        docker {
            image 'docker:dind'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }
    
    environment {
        GITHUB_REPO_URL = 'https://github.com/halephu01/Jenkins-CI-CD.git'
        BRANCH_NAME = 'main'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: "${BRANCH_NAME}",
                    url: "${GITHUB_REPO_URL}"
            }
        }
        
        stage('Build and Deploy') {
            steps {
                script {
                    def maxRetries = 3
                    def retryCount = 0
                    def success = false
                    
                    while (!success && retryCount < maxRetries) {
                        try {
                            sh 'docker-compose pull'
                            sh 'docker-compose up -d'
                            success = true
                        } catch (Exception e) {
                            retryCount++
                            echo "Attempt ${retryCount}/${maxRetries} failed: ${e.message}"
                            if (retryCount < maxRetries) {
                                sleep(time: 30, unit: 'SECONDS')
                            }
                        }
                    }
                    
                    if (!success) {
                        error "Failed to pull and start containers after ${maxRetries} attempts"
                    }
                }
            }
        }
        
        stage('Start and Verify Services') {
            steps {
                script {
                    sh 'docker-compose up -d'
                    sleep(time: 120, unit: 'SECONDS')
                    
                    def maxRetries = 10
                    def retryCount = 0
                    def success = false
                    
                    while (!success && retryCount < maxRetries) {
                        try {
                            sh 'docker-compose ps --services'
                            sh 'docker ps | grep api-gateway'
                            sh 'docker logs api-gateway'
                            
                            def status = sh(script: 'docker inspect -f {{.State.Status}} api-gateway', returnStdout: true).trim()
                            def health = sh(script: 'docker inspect -f {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} api-gateway', returnStdout: true).trim()
                            
                            echo "API Gateway Status: ${status}"
                            echo "API Gateway Health: ${health}"
                            
                            if (status == 'running' && (health == 'healthy' || health == 'none')) {
                                success = true
                                echo "API Gateway is healthy!"
                            } else {
                                retryCount++
                                echo "Attempt ${retryCount}/${maxRetries}: Waiting for API Gateway to be healthy..."
                                sleep(time: 30, unit: 'SECONDS')
                            }
                        } catch (Exception e) {
                            retryCount++
                            echo "Attempt ${retryCount}/${maxRetries} failed: ${e.message}"
                            sleep(time: 30, unit: 'SECONDS')
                        }
                    }
                    
                    if (!success) {
                        error "Container api-gateway is not healthy after ${maxRetries} attempts"
                    }
                }
            }
        }
        
        stage('Cleanup') {
            steps {
                sh 'docker-compose down'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}


