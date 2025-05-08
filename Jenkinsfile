pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
        EC2_USER = 'ubuntu' // EC2 username for SSH
        EC2_HOST = '51.20.98.107' // Your EC2 instance IP address
        EC2_DIR = '/home/ubuntu/myapp' // Directory on EC2 where the app is deployed
        KEY_CRED_ID = 'ubuntu' // Jenkins SSH credentials ID for private key
    }

    tools {
        nodejs 'Node 18' // Ensure this matches the name of NodeJS in your Jenkins Tool configuration
    }

    stages {
        stage('Clone Repository') {
            steps {
                // Clone the repository from GitHub
                git branch: 'main', url: 'https://github.com/shivamsharma-tech/Docker-test' // Change to your repository URL
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install the project dependencies
                sh 'npm install'
            }
        }

        stage('Build (Optional)') {
            when {
                // Run the build stage only if the 'build' folder exists
                expression { fileExists('build') }
            }
            steps {
                // Run the build command if required
                sh 'npm run build'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(credentials: ["${KEY_CRED_ID}"]) {
                    script {
                        // Deploy to EC2: Use SCP to copy files, then SSH to manage the app
                        sh '''
                        echo '🚀 Deploying to EC2 instance...'
                        scp -o StrictHostKeyChecking=no app.js ${EC2_USER}@${EC2_HOST}:${EC2_DIR}

                        # SSH into the EC2 instance and use pm2 to manage the app
                        ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} << EOF
                            cd ${EC2_DIR}
                            pm2 restart myapp || pm2 start app.js --name myapp
                            sudo fuser -k 3000/tcp || true  # Kill any process running on port 3000
                        EOF
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            // Display success message after deployment
            echo '✅ Deployment succeeded!'
        }
        failure {
            // Display failure message if something goes wrong
            echo '❌ Deployment failed!'
        }
    }
}
