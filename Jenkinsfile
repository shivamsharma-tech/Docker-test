pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '51.20.98.107 '
        EC2_DIR = '/home/ubuntu/myapp'
        SSH_KEY = 'ubuntu' // Your Jenkins SSH credentials ID
        PORTS = "3000 4000 5000"
    }

    // tools {
        // nodejs 'Node 18' // Match your Jenkins NodeJS setup name
    // }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/shivamsharma-tech/your-repo'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Deploy to Multiple Ports') {
            steps {
                sshagent (credentials: [env.SSH_KEY]) {
                    script {
                        for (port in env.PORTS.split()) {
                            sh """
                            scp -o StrictHostKeyChecking=no -r . ${EC2_USER}@${EC2_HOST}:${EC2_DIR}-${port}
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << EOF
                                cd ${EC2_DIR}-${port}
                                npm install
                                PORT=${port} pm2 start app.js --name myapp-${port} || pm2 restart myapp-${port}
EOF
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