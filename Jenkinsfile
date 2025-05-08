pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '51.20.98.107'
        EC2_DIR = '/home/ubuntu/myapp'
        SSH_KEY = 'ubuntu' // Your Jenkins SSH credentials ID
        PORTS = "3000 4000 5000"
    }

    tools {
        nodejs 'node 18' // Match your Jenkins NodeJS setup name
    }

    stages {
        stage('Clone Repository') {
            steps {
                 git(
            url: 'https://github.com/shivamsharma-tech/Docker-test',
            branch: 'main',
            credentialsId: 'git-hub' // 👈 Use the same credential ID used in checkout
        )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Deploy to Multiple Ports') {
            steps {
                sshagent (credentials: ["ubuntu"]) {
                    script {
                        for (port in env.PORTS.split()) {
                            sh """
                            scp -o StrictHostKeyChecking=no -r . ${EC2_USER}@${EC2_HOST}:${EC2_DIR}-${port}
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST}
                                cd ${EC2_DIR}-${port}
                                npm install
                                PORT=${port} pm2 start app.js --name myapp-${port} || pm2 restart myapp-${port}
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployed to all ports successfully!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}