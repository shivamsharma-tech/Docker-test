pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '51.20.98.107'
        EC2_KEY = credentials('ubuntu') // Add your SSH private key in Jenkins Credentials
        REMOTE_APP_DIR = '/home/ubuntu/myapp'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Deploy to EC2 - Multi-Port') {
            matrix {
                axes {
                    axis {
                        name 'PORT'
                        values '3000', '8080'  // Add more ports if needed
                    }
                }

                stages {
                    stage('Copy & Restart on Port ${PORT}') {
                        steps {
                            sh '''
                                echo "Deploying to port ${PORT} on EC2"

                                # Copy files to EC2
                                scp -o StrictHostKeyChecking=no -i ${EC2_KEY} -r * ${EC2_USER}@${EC2_HOST}:${REMOTE_APP_DIR}/

                                # Run remote commands
                                ssh -o StrictHostKeyChecking=no -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} <<EOF
                                    cd ${REMOTE_APP_DIR}
                                    export PORT=${PORT}
                                    pm2 delete myapp-${PORT} || true
                                    pm2 start app.js --name myapp-${PORT} --env PORT=${PORT}
                                EOF
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment succeeded on all ports!"
        }
        failure {
            echo "❌ Deployment failed. Check logs above."
        }
    }
}