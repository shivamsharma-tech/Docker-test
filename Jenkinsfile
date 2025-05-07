pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    dockerImage = docker.build("multi-app")
                }
            }
        }

        stage('Stop Old Containers') {
            steps {
                script {
                    // List of ports you want to deploy on
                    def ports = [3000, 3001, 3002]

                    // Loop to remove any running containers on the same ports
                    for (p in ports) {
                        sh "docker rm -f app-${p} || true"  // Ignore error if the container is not running
                    }
                }
            }
        }

        stage('Run on Multiple Ports') {
            steps {
                script {
                    // List of ports you want to deploy on
                    def ports = [3000, 3001, 3002]

                    // Loop to run containers on the specified ports
                    for (p in ports) {
                        sh "docker run -d -p ${p}:3000 --name app-${p} multi-app"
                    }
                }
            }
        }
    }
}
