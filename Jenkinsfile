pipeline {
    agent any

    environment {
        DOCKER_USERNAME = 'anasmnasri'
        IMAGE_BACKEND   = "${DOCKER_USERNAME}/elearning-backend"  // ✅ corrigé
        IMAGE_FRONTEND  = "${DOCKER_USERNAME}/elearning-frontend" // ✅ corrigé
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

        stage('Install & Cache Backend') {
            steps {
                dir('Deployement/E-LearningBackend') {
                    script {
                        def cacheDir = "C:\\jenkins-cache\\backend-node_modules"
                        def targetDir = "${env.WORKSPACE}\\Deployement\\E-LearningBackend\\node_modules"
                        if (fileExists(cacheDir)) {
                            echo "Cache Backend trouvé — restauration..."
                            bat "xcopy /E /I /Y /Q \"${cacheDir}\" \"${targetDir}\""
                        } else {
                            echo "Pas de cache — installation complète..."
                        }
                    }
                    bat 'npm install'
                    bat 'npm install --save-dev mocha chai'
                    script {
                        def cacheDir = "C:\\jenkins-cache\\backend-node_modules"
                        bat "xcopy /E /I /Y /Q \"node_modules\" \"${cacheDir}\""
                        echo "Cache Backend sauvegardé"
                    }
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('Deployement/E-LearningBackend') {
                    script {
                        def hasTestFiles = bat(
                            script: 'if exist test\\ (exit 0) else (exit 1)',
                            returnStatus: true
                        )
                        if (hasTestFiles == 0) {
                            echo "Lancement des tests Mocha & Chai..."
                            bat 'npx mocha --recursive --timeout 10000'
                        } else {
                            echo "Aucun dossier test/ trouvé — étape ignorée"
                        }
                    }
                }
            }
        }

        stage('Install & Cache Frontend') {
            steps {
                dir('Deployement/E-LearningFrontend') {
                    script {
                        def cacheDir = "C:\\jenkins-cache\\frontend-node_modules"
                        def targetDir = "${env.WORKSPACE}\\Deployement\\E-LearningFrontend\\node_modules"
                        if (fileExists(cacheDir)) {
                            echo "Cache Frontend trouvé — restauration..."
                            bat "xcopy /E /I /Y /Q \"${cacheDir}\" \"${targetDir}\""
                        } else {
                            echo "Pas de cache — installation complète..."
                        }
                    }
                    bat 'npm install'
                    script {
                        def cacheDir = "C:\\jenkins-cache\\frontend-node_modules"
                        bat "xcopy /E /I /Y /Q \"node_modules\" \"${cacheDir}\""
                        echo "Cache Frontend sauvegardé"
                    }
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('Deployement/E-LearningFrontend') {
                    echo "Lancement des tests Jest..."
                    bat 'set CI=true && npm test -- --watchAll=false --passWithNoTests'
                }
            }
        }

        stage('SonarQube Analysis') {
    options {
        timeout(time: 10, unit: 'MINUTES')
    }
    steps {
        dir('Deployement') {
            withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                bat '''
docker run --rm ^
  --memory=2g ^
  --memory-swap=4g ^
  --network=container:sonarqube ^
  -e SONAR_HOST_URL=http://localhost:9000 ^
  -e SONAR_TOKEN=%SONAR_TOKEN% ^
  -e SONAR_SCANNER_OPTS="-Xmx1536m -Xms256m" ^
  -v %CD%:/usr/src ^
  sonarsource/sonar-scanner-cli ^
  -Dsonar.projectKey=e-learning ^
  -Dsonar.projectBaseDir=/usr/src ^
  -Dsonar.sources=E-LearningBackend,E-LearningFrontend ^
  -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/*.conf,**/package-lock.json,**/yarn.lock ^
  -Dsonar.javascript.node.maxspace=1024 ^
  -Dsonar.javascript.maxFileSize=1000
'''
            }
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
                    bat 'docker build -t %IMAGE_BACKEND%:latest ./E-LearningBackend'
                    bat 'docker push %IMAGE_BACKEND%:latest'
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                dir('Deployement') {
                    bat 'docker build -t %IMAGE_FRONTEND%:latest ./E-LearningFrontend'
                    bat 'docker push %IMAGE_FRONTEND%:latest'
                }
            }
        }

        // ✅ NOUVEAU — Deploy Kubernetes
    stage('Deploy to Kubernetes') {
    steps {
        withCredentials([sshUserPrivateKey(
            credentialsId: 'k8s-master-ssh',
            keyFileVariable: 'SSH_KEY'
        )]) {
            bat 'ssh -i %SSH_KEY% -o StrictHostKeyChecking=no anas@192.168.48.45 "kubectl apply -f ~/kubernetes/ --validate=false"'
            bat 'ssh -i %SSH_KEY% -o StrictHostKeyChecking=no anas@192.168.48.45 "kubectl rollout restart deployment/elearning-backend"'
            bat 'ssh -i %SSH_KEY% -o StrictHostKeyChecking=no anas@192.168.48.45 "kubectl rollout restart deployment/elearning-frontend"'
            bat 'ssh -i %SSH_KEY% -o StrictHostKeyChecking=no anas@192.168.48.45 "kubectl rollout status deployment/elearning-backend --timeout=120s"'
            bat 'ssh -i %SSH_KEY% -o StrictHostKeyChecking=no anas@192.168.48.45 "kubectl rollout status deployment/elearning-frontend --timeout=120s"'
        }
    }
}
    }

    post {
        success {
            echo '✅ Build, Tests, Push et Deploy réussis !'
        }
        failure {
            echo '❌ Echec du pipeline. Vérifier les logs.'
        }
        always {
            bat 'docker logout'
        }
    }
}
