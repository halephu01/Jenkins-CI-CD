pipeline {
    agent any
    
    environment {
        JAVA_HOME = '/opt/java/openjdk'  
        MAVEN_HOME = '/usr/share/maven'                   
        PATH = "${JAVA_HOME}/bin:${MAVEN_HOME}/bin:${env.PATH}"
        GITHUB_CREDENTIALS = credentials('github-credentials')
    }

    stages {
        stage('Checkout từ GitHub') {
            steps {
                git branch: 'main', 
                    credentialsId: 'github-credentials',
                    url: 'https://github.com/halephu01/Jenkins-CI-CD.git'
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
                        sh '''
                            cd docker
                            docker-compose up --build
                        '''
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
