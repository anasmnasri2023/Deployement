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
                sh 'git clone https://github.com/anasmnasri2023/Deployement.git'
            }
        }
    }
}