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

        // ─── CACHE node_modules Backend ───────────────────────────────────────
        stage('Install & Cache Backend') {
            steps {
                dir('Deployement/E-LearningBackend') {
                    // Restore cache si node_modules existe déjà
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
                    // Sauvegarde du cache après install
                    script {
                        def cacheDir = "C:\\jenkins-cache\\backend-node_modules"
                        bat "xcopy /E /I /Y /Q \"node_modules\" \"${cacheDir}\""
                        echo "✅ Cache Backend sauvegardé"
                    }
                }
            }
        }

        // ─── TEST Backend ──────────────────────────────────────────────────────
        stage('Test Backend') {
            steps {
                dir('Deployement/E-LearningBackend') {
                    script {
                        // Vérifie si un script test est défini dans package.json
                        def hasTest = bat(
                            script: 'node -e "const p=require(\'./package.json\'); process.exit(p.scripts && p.scripts.test ? 0 : 1)"',
                            returnStatus: true
                        )
                        if (hasTest == 0) {
                            bat 'npm test'
                        } else {
                            echo "⚠️ Aucun script test défini dans package.json — étape ignorée"
                        }
                    }
                }
            }
        }

        // ─── CACHE node_modules Frontend ──────────────────────────────────────
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

        // ─── TEST Frontend ─────────────────────────────────────────────────────
        stage('Test Frontend') {
            steps {
                dir('Deployement/E-LearningFrontend') {
                    script {
                        def hasTest = bat(
                            script: 'node -e "const p=require(\'./package.json\'); process.exit(p.scripts && p.scripts.test ? 0 : 1)"',
                            returnStatus: true
                        )
                        if (hasTest == 0) {
                            // CI=true évite que React bloque le pipeline sur les warnings
                            bat 'set CI=true && npm test -- --watchAll=false'
                        } else {
                            echo "⚠️ Aucun script test défini dans package.json — étape ignorée"
                        }
                    }
                }
            }
        }

        // ─── DOCKER LOGIN ──────────────────────────────────────────────────────
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

        // ─── BUILD & PUSH Backend ──────────────────────────────────────────────
        stage('Build & Push Backend Image') {
            steps {
                dir('Deployement') {
                    bat 'docker build -t %IMAGE_BACKEND% ./E-LearningBackend'
                    bat 'docker push %IMAGE_BACKEND%'
                }
            }
        }

        // ─── BUILD & PUSH Frontend ─────────────────────────────────────────────
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
            // Nettoyage des credentials Docker après chaque run
            bat 'docker logout'
        }
    }
}