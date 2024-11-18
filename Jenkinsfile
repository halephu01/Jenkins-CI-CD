pipeline {
    agent any
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        JAVA_HOME = '/usr/lib/jvm/java-21-openjdk'
        PATH = "${JAVA_HOME}/bin:${env.PATH}"
    }
    stages {
        stage('Install Dependencies') {
            steps {
                script {
                    // Install required packages
                    sh '''
                        # Update package list
                        sudo apt-get update
                        
                        # Install OpenJDK 21
                        sudo apt-get install -y openjdk-21-jdk
                        
                        # Install Maven
                        sudo apt-get install -y maven
                        
                        # Install Docker if not present
                        if ! command -v docker &> /dev/null; then
                            sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
                            curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
                            sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
                            sudo apt-get update
                            sudo apt-get install -y docker-ce docker-ce-cli containerd.io
                        fi
                        
                        # Add Jenkins user to docker group
                        sudo usermod -aG docker jenkins
                        
                        # Install Docker Compose
                        sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
                        sudo chmod +x /usr/local/bin/docker-compose
                        
                        # Verify installations
                        java -version
                        mvn -version
                        docker --version
                        docker-compose --version
                    '''
                }
            }
        }

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
