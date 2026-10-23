
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DOCKER_IMAGE = 'shubhdevo/opspilot-dashboard'
        DOCKER_CRED_ID = 'docker-hub-credentials'
        KUBE_CRED_ID = 'kubernetes-config-credential'
        K8S_NAMESPACE = 'default'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Test Application') {
            steps {
                sh '''
                    docker run --rm \
                      -v "$WORKSPACE:/app" \
                      -w /app \
                      node:22-alpine \
                      npm test
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t "$DOCKER_IMAGE:$BUILD_NUMBER" .
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'docker-hub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        set +x
                        printf '%s' "$DOCKER_PASS" |
                          docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        docker push "$DOCKER_IMAGE:$BUILD_NUMBER"
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([
                    file(
                        credentialsId: 'kubernetes-config-credential',
                        variable: 'KUBECONFIG_FILE'
                    )
                ]) {
                    sh '''
                        set -eu
                        export KUBECONFIG="$KUBECONFIG_FILE"

                        sed \
                          "s|image: opspilot:latest|image: $DOCKER_IMAGE:$BUILD_NUMBER|" \
                          deployment.yml > deployment-rendered.yml

                        kubectl apply \
                          -n "$K8S_NAMESPACE" \
                          -f deployment-rendered.yml

                        kubectl apply \
                          -n "$K8S_NAMESPACE" \
                          -f service.yml

                        kubectl rollout status \
                          deployment/opspilot-deployment \
                          -n "$K8S_NAMESPACE" \
                          --timeout=180s

                        kubectl get deployments \
                          -n "$K8S_NAMESPACE"

                        kubectl get pods \
                          -n "$K8S_NAMESPACE"

                        kubectl get services \
                          -n "$K8S_NAMESPACE"
                    '''
                }
            }
        }
    }

    post {
        always {
            sh '''
                docker image rm "$DOCKER_IMAGE:$BUILD_NUMBER" \
                  >/dev/null 2>&1 || true
            '''
            echo 'Pipeline finished.'
        }

        success {
            echo 'OpsPilot deployment succeeded.'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}

