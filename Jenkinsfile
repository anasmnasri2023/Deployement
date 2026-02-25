pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'anasmnasri'
        IMAGE_BACKEND   = "${DOCKER_USERNAME}/node-app"
        IMAGE_FRONTEND  = "${DOCKER_USERNAME}/react-app"
    }

    stages {

        stage('Clean up') {
            steps {
                deleteDir()
            }
        }

        stage('Clone repo') {
            steps {
                bat 'git clone https://github.com/anasmnasri2023/Deployement.git'
            }
        }

        stage('Install & Test Backend') {
            steps {
                dir('Deployement/E-LearningBackend') {
                    bat 'npm install'
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'anasmnasri',  
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                }
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                dir('Deployement') {
                    bat 'docker build -t %IMAGE_BACKEND% ./E-LearningBackend'
                    bat 'docker push %IMAGE_BACKEND%'
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                dir('Deployement') {
                    bat 'docker build -t %IMAGE_FRONTEND% ./E-LearningFrontend'
                    bat 'docker push %IMAGE_FRONTEND%'
                }
            }
        }

    }

    post {
        success {
            echo 'Build & Push réussis pour le backend et le frontend !'
        }
        failure {
            echo 'Echec du pipeline. Vérifier les logs.'
        }
    }
}