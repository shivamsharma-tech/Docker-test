pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '51.20.98.107'
        EC2_DIR = '/home/ubuntu/myapp'
        SSH_KEY = 'ubuntu' // Jenkins SSH credentials ID
        PORTS = "3000 4000 5000"
    }

    tools {
        nodejs 'node 18' // Must match Node.js installation in Jenkins
    }

    stages {
        stage('Clone Repository') {
            steps {
                git(
                    url: 'https://github.com/shivamsharma-tech/Docker-test',
                    branch: 'main',
                    credentialsId: 'git-hub'
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
                sshagent(credentials: [env.SSH_KEY]) {
                    script {
    for (port in env.PORTS.split()) {
        echo "🚀 Deploying to port ${port}..."

        sh """
        rsync -avz --exclude=node_modules --exclude=.git --exclude=*.log -e "ssh -o StrictHostKeyChecking=no" . ${EC2_USER}@${EC2_HOST}:${EC2_DIR}-${port}
        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
            set -e
            cd ${EC2_DIR}-${port}
            npm install
            PORT=${port} pm2 start app.js --name myapp-${port} || pm2 restart myapp-${port}
        '
        """

        echo "✅ Finished deploying to port ${port}"
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