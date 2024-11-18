pipeline {
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
        
        stage('Start and Verify Services') {
            steps {
                script {
                    sh 'docker-compose up -d'
                    sleep(time: 120, unit: 'SECONDS')
                    
                    def maxRetries = 5
                    def retryCount = 0
                    def success = false
                    
                    while (!success && retryCount < maxRetries) {
                        try {
                            def services = sh(script: 'docker-compose ps --services', returnStdout: true).trim().split('\n')
                            def allHealthy = true
                            
                            for (service in services) {
                                sh "docker ps | grep ${service}"
                                sh "docker logs ${service}"
                                
                                def status = sh(script: "docker inspect -f {{.State.Status}} ${service}", returnStdout: true).trim()
                                def health = sh(script: "docker inspect -f {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} ${service}", returnStdout: true).trim()
                                
                                echo "${service} Status: ${status}"
                                echo "${service} Health: ${health}"
                                
                                if (!(status == 'running' && (health == 'healthy' || health == 'none'))) {
                                    allHealthy = false
                                    echo "${service} is not healthy!"
                                    break
                                }
                            }
                            
                            if (allHealthy) {
                                success = true
                                echo "All services are healthy!"
                            } else {
                                retryCount++
                                echo "Attempt ${retryCount}/${maxRetries}: Waiting for all services to be healthy..."
                                sleep(time: 30, unit: 'SECONDS')
                            }
                        } catch (Exception e) {
                            retryCount++
                            echo "Attempt ${retryCount}/${maxRetries} failed: ${e.message}"
                            sleep(time: 30, unit: 'SECONDS')
                        }
                    }
                    
                    if (!success) {
                        error "Not all containers are healthy after ${maxRetries} attempts"
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


