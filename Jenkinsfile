pipeline {
    agent any

    environment {
        EC2_USER = 'ubuntu'
        EC2_HOST = '51.20.98.107'  // Replace with your actual EC2 host
        EC2_KEY = credentials('ubuntu')  // Ensure SSH key credentials are configured in Jenkins
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install npm dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Deploy to EC2') {
            matrix {
                axes {
                    axis {
                        name 'DEPLOY_ENV'
                        values 'staging', 'production'  // Add more environments if necessary
                    }
                    axis {
                        name 'PORT'
                        values '3000', '8080'  // Define different ports for each environment
                    }
                }
                stages {
                    stage('Deploy to EC2 for ${DEPLOY_ENV} on port ${PORT}') {
                        steps {
                            script {
                                echo "🚀 Deploying to EC2 environment: ${DEPLOY_ENV} on port ${PORT}"

                                // Deployment steps for SCP and SSH, including dynamic port handling
                                sh """
                                    scp -o StrictHostKeyChecking=no -i ${EC2_KEY} app.js ${EC2_USER}@${EC2_HOST}:/home/ubuntu/myapp
                                    ssh -o StrictHostKeyChecking=no -i ${EC2_KEY} ${EC2_USER}@${EC2_HOST} <<EOF
                                    echo "Deploying ${DEPLOY_ENV} environment on port ${PORT}"
                                    cd /home/ubuntu/myapp
                                    pm2 restart myapp || pm2 start app.js --name myapp --port ${PORT}
                                    EOF
                                """
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully!'
        }

        failure {
            echo '❌ Deployment failed! Check the logs above for errors.'
            // Additional failure notification (e.g., Slack, email, etc.)
        }
    }
}
