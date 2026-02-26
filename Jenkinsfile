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

        // ─── CACHE + INSTALL Backend ───────────────────────────────────────────
        stage('Install & Cache Backend') {
            steps {
                dir('Deployement/E-LearningBackend') {
                    script {
                        def cacheDir = "C:\\jenkins-cache\\backend-node_modules"
                        def targetDir = "${env.WORKSPACE}\\Deployement\\E-LearningBackend\\node_modules"
                        if (fileExists(cacheDir)) {
                            echo "♻️ Cache Backend trouvé — restauration..."
                            bat "xcopy /E /I /Y /Q \"${cacheDir}\" \"${targetDir}\""
                        } else {
                            echo "⚠️ Pas de cache — installation complète..."
                        }
                    }
                    bat 'npm install'
                    // Installation Mocha & Chai
                    bat 'npm install --save-dev mocha chai'
                    script {
                        def cacheDir = "C:\\jenkins-cache\\backend-node_modules"
                        bat "xcopy /E /I /Y /Q \"node_modules\" \"${cacheDir}\""
                        echo "✅ Cache Backend sauvegardé"
                    }
                }
            }
        }

        // ─── TEST Backend avec Mocha & Chai ────────────────────────────────────
        stage('Test Backend') {
            steps {
                dir('Deployement/E-LearningBackend') {
                    script {
                        // Vérifie si un dossier test/ ou fichiers .test.js existent
                        def hasTestFiles = bat(
                            script: 'if exist test\\ (exit 0) else (exit 1)',
                            returnStatus: true
                        )
                        if (hasTestFiles == 0) {
                            echo "🧪 Lancement des tests Mocha & Chai..."
                            bat 'npx mocha --recursive --timeout 10000'
                        } else {
                            echo "⚠️ Aucun dossier test/ trouvé — étape ignorée"
                        }
                    }
                }
            }
        }

        // ─── CACHE + INSTALL Frontend ──────────────────────────────────────────
        stage('Install & Cache Frontend') {
            steps {
                dir('Deployement/E-LearningFrontend') {
                    script {
                        def cacheDir = "C:\\jenkins-cache\\frontend-node_modules"
                        def targetDir = "${env.WORKSPACE}\\Deployement\\E-LearningFrontend\\node_modules"
                        if (fileExists(cacheDir)) {
                            echo "♻️ Cache Frontend trouvé — restauration..."
                            bat "xcopy /E /I /Y /Q \"${cacheDir}\" \"${targetDir}\""
                        } else {
                            echo "⚠️ Pas de cache — installation complète..."
                        }
                    }
                    bat 'npm install'
                    script {
                        def cacheDir = "C:\\jenkins-cache\\frontend-node_modules"
                        bat "xcopy /E /I /Y /Q \"node_modules\" \"${cacheDir}\""
                        echo "✅ Cache Frontend sauvegardé"
                    }
                }
            }
        }

        // ─── TEST Frontend avec Jest ────────────────────────────────────────────
        stage('Test Frontend') {
            steps {
                dir('Deployement/E-LearningFrontend') {
                    echo "🧪 Lancement des tests Jest..."
                    // CI=true     → pas de mode interactif
                    // --watchAll=false    → exécution unique
                    // --passWithNoTests   → ne bloque pas si aucun test trouvé
                    bat 'set CI=true && npx react-scripts test --watchAll=false --passWithNoTests'
                }
            }
        }

        // ─── DOCKER LOGIN ───────────────────────────────────────────────────────
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

        // ─── BUILD & PUSH Backend ───────────────────────────────────────────────
        stage('Build & Push Backend Image') {
            steps {
                dir('Deployement') {
                    bat 'docker build -t %IMAGE_BACKEND% ./E-LearningBackend'
                    bat 'docker push %IMAGE_BACKEND%'
                }
            }
        }

        // ─── BUILD & PUSH Frontend ──────────────────────────────────────────────
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
            echo '✅ Build, Tests & Push réussis pour le backend et le frontend !'
        }
        failure {
            echo '❌ Echec du pipeline. Vérifier les logs.'
        }
        always {
            bat 'docker logout'
        }
    }
}