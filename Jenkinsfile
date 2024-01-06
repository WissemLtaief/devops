pipeline {
    agent any

    environment {
        // Define environment variables, Docker registry, etc.
        DOCKER_IMAGE_BACKEND  = "wissemletaief/myapp-backend"
        DOCKER_IMAGE_FRONTEND = "wissemletaief/myapp-frontend"
        // More environment variables can be added here
    }

    stages {
        stage('Checkout') {
            steps {
                // Get the latest code from your source control
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    // Build the Docker image for the backend
                    docker.build "${DOCKER_IMAGE_BACKEND}"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    // Build the Docker image for the frontend
                    docker.build "${DOCKER_IMAGE_FRONTEND}"
                }
            }
        }

       // stage('Unit Tests') {
            //steps {
                //'npm test'
            //}
        //}

        stage('Push to Registry') {
        when {
            branch 'main' // Only push images for the main branch
        }
        steps {
            script {
                // Login to Docker Hub and push the images
                docker.withRegistry('https://registry.hub.docker.com', 'wissemletaief') {
                    docker.image("${DOCKER_IMAGE_BACKEND}").push()
                    docker.image("${DOCKER_IMAGE_FRONTEND}").push()
                    
                }
            }
        }
    }

        stage('Deploy') {
            when {
                branch 'main' 
            }
            steps {
                // Deploy your application
                // This might involve SSHing to a server, using a tool like Ansible, or a Kubernetes deployment
            }
        }
    }

    post {
        always {
            // Actions to perform after the pipeline completes
            // For example, clean up, send notifications, etc.
        }
    }
}
