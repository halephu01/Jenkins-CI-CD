pipeline {
    agent any
    
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
                sh 'docker-compose up -d'
            }
        }
        
        stage('Start and Verify Services') {
            steps {
                script {
                    sh 'docker-compose up -d'
                    
                    sleep(time: 60, unit: 'SECONDS')
                    
                    def containers = sh(
                        script: 'docker-compose ps --services',
                        returnStdout: true
                    ).trim().split('\n')
                    
                    containers.each { container ->
                        def containerStatus = sh(
                            script: "docker inspect -f '{{.State.Status}}' ${container}",
                            returnStdout: true
                        ).trim()
                        
                        def healthStatus = sh(
                            script: "docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' ${container}",
                            returnStdout: true
                        ).trim()
                        
                        if (containerStatus != 'running') {
                            error "Container ${container} is not running. Status: ${containerStatus}"
                        }
                        
                        if (healthStatus != 'none' && healthStatus != 'healthy') {
                            error "Container ${container} is not healthy. Health status: ${healthStatus}"
                        }
                        
                        def hasErrors = sh(
                            script: "docker-compose logs ${container} | grep -i 'error\\|exception\\|failed' || true",
                            returnStdout: true
                        ).trim()
                        
                        if (hasErrors) {
                            echo "Warning: Found potential errors in ${container} logs:"
                            echo hasErrors
                        }
                        
                        echo "Container ${container} is running properly"
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


