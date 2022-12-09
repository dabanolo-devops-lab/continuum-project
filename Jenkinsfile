def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]

pipeline {

    agent {
        node {
            label 'node'
        }
    }

    environment {
        ECR_REPOSITORY = credentials('chat-ecr-repository')
        VERSION = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
    }

    options {
        ansiColor('xterm')
    }

    stages {
        
        stage('Checkout Sources') {
            when {
                not{
                    branch 'main'
                }
            }
            steps {
                git branch: '${BRANCH_NAME}', credentialsId: 'jenkins-dabanolo-continuum', url: 'https://github.com/dabanolo-devops-lab/continuum-project'
            }
        }
    
        stage('Build') {
            when {
                not{
                    branch 'main'
                }
            }
            steps {
                sh 'docker images prune'
                sh 'docker build -t chatapp/testphase:${BUILD_ID} .'
            }
        }
        
        stage('Unit Testing') {
            when {
                not{
                    branch 'main'
                }
            }
            steps {
                sh 'docker run --tty chatapp/testphase:${BUILD_ID} npm test'
            }
        }

        stage('Scan w/ Trivy') {
            when {
                branch 'dev'
            }
            steps {
                sh 'trivy image chatapp/testphase:${BUILD_ID}'
            }
        }

        stage('Create Build Version') {
            when {
                branch 'dev'
            }
            steps {
                sh 'echo ${BUILD_ID} > /home/ubuntu/jenkins/buildID.txt'
            }
        }

        // stage('Build w/ SonarQube') {
        //     when {
        //         branch 'dev'
        //     }
        //     steps {
        //         sh 'docker run --tty --env SONAR_HOST_URL="http://sonarqube:9000" --env SONAR_LOGIN="admin" --env SONAR_PASSWORD="admin" chatapp/testphase:${VERSION} npm run sonar'
        //     }
        // }

        stage('Image to Production') {
            when {
                branch 'main'
            }
            environment{
                BUILDV = sh(script: "cat /home/ubuntu/jenkins/buildID.txt", returnStdout: true).trim()
            }
            steps {
                withAWS(region:'us-east-1',credentials:'dabanolo-aws-credentials'){
                    sh 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REPOSITORY}'
                    sh 'docker tag chatapp/testphase:${BUILDV} ${ECR_REPOSITORY}/chat-app:${BUILDV}'
                }
            }
        }

        stage('Deploy'){
            when {
                branch 'main'
            }
            environment{
                BUILDV = sh(script: "cat /home/ubuntu/jenkins/buildID.txt", returnStdout: true).trim()
            }
            steps {
                withAWS(region:'us-east-1',credentials:'dabanolo-aws-credentials'){

                    input message: 'Which branch and environment do you want to deploy?',
                    parameters: [
                        choice(name: 'BRANCH', choices: ['master', 'dev'], description: 'Branch'),
                        choice(name: 'ENVIRONMENT', choices: ['prod', 'staging'], description: 'Environment')
                    ]
                }
            }
        }
    }
}
