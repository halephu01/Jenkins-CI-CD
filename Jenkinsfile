pipeline {
    agent any
    
    environment {
        JAVA_HOME = '/usr/lib/jvm/java-17-openjdk-amd64'  // Điều chỉnh path Java nếu cần
        MAVEN_HOME = '/usr/share/maven'                    // Điều chỉnh path Maven nếu cần
        PATH = "${JAVA_HOME}/bin:${MAVEN_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code từ repository
                checkout scm
            }
        }

        stage('Build Maven') {
            steps {
                script {
                    try {
                        sh 'mvn clean package -DskipTests'
                    } catch (Exception e) {
                        error "Maven build thất bại: ${e.message}"
                    }
                }
            }
        }

        stage('Build và Run Docker') {
            steps {
                script {
                    try {
                        dir('docker') {
                            sh 'docker-compose up --build -d'
                            
                            sh 'docker-compose logs'
                        }
                    } catch (Exception e) {
                        error "Docker build/run thất bại: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline đã chạy thành công!'
        }
        failure {
            echo 'Pipeline thất bại!'
            script {
                dir('docker') {
                    sh 'docker-compose down -v || true'
                }
            }
        }
        always {
            cleanWs()
        }
    }
}
