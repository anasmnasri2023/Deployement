pipeline {
    agent any

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
        stage('Build / Deploy') {
            steps {
                dir('Deployement') {
                    bat 'echo "Ici tes commandes de build..."'
                }
            }
        }
    }
}