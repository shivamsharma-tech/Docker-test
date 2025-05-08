pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        EC2_USER = 'ubuntu'
        EC2_HOST = '51.20.98.107'
        EC2_DIR = '/home/ubuntu/myapp'
        KEY_CRED_ID = 'ubuntu' // ID of SSH private key in Jenkins Credentials
    }

    tools {
        nodejs 'Node 18' // Match the name set in Global Tool Configuration
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/shivamsharma-tech/Docker-test'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build (Optional)') {
            when {
                expression { fileExists('build') }
            }
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2') {
    steps {
        sshagent (credentials: ["${KEY_CRED_ID}"]) {
            sh '''
scp -o StrictHostKeyChecking=no app.js ${EC2_USER}@${EC2_HOST}:${EC2_DIR}
ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << EOF
cd ${EC2_DIR}
pm2 restart myapp || pm2 start app.js --name myapp
sudo fuser -k 3000/tcp || true
EOF
            '''
        }
    }
}
    }

    post {
        success {
            echo '✅ Deployment succeeded!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}
