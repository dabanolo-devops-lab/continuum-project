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
                    sh 'docker build -t ${ECR_REPOSITORY}/chat-app:${BUILDV} -f prod.Dockerfile .'
                    sh 'docker push ${ECR_REPOSITORY}/chat-app:${BUILDV}'
                }

            }
        }
        stage('Task Config'){
            when {
                branch 'main'
            }
            environment{

                EXEC_ROLE = credentials('aws-exec-role')

                TASK_ROLE = credentials('aws-task-role')

                NAME = credentials('cluster-name')

                IMAGE = credentials('chat-ecr-repository')

                BUILDV = sh(script: "cat /home/ubuntu/jenkins/buildID.txt", returnStdout: true).trim()

                LOG_GROUP = "/ecs/chat-app"


            }
            steps{
                sh 'rm /home/ubuntu/jenkins/terraform/main.tf'
                sh 'cp /home/ubuntu/jenkins/templates/main.tf /home/ubuntu/jenkins/terraform/main.tf'
                sh 'sed -i "s/1111111/${EXEC_ROLE}/g" /home/ubuntu/jenkins/terraform/main.tf'
                sh 'sed -i "s/2222222/${TASK_ROLE}/g" /home/ubuntu/jenkins/terraform/main.tf'
                sh 'sed -i "s/3333333/${NAME}/g" /home/ubuntu/jenkins/terraform/main.tf'
                sh 'sed -i "s/4444444/${IMAGE}/g" /home/ubuntu/jenkins/terraform/main.tf'
                sh 'sed -i "s/5555555/${BUILDV}/g" /home/ubuntu/jenkins/terraform/main.tf'
                sh 'sed -i "s/0000000/${LOG_GROUP}/g" /home/ubuntu/jenkins/terraform/main.tf'
            }
        }

        stage('Deploy w/ Terraform') {

            environment{
                BUILDV = sh(script: "cat /home/ubuntu/jenkins/buildID.txt", returnStdout: true).trim()
            }
            when {
                branch 'main'
            }
            steps {
                
                withAWS(region:'us-east-1',credentials:'dabanolo-aws-credentials'){
                    script {
                    def USER_INPUT = input(
                        message: 'Which branch and environment do you want to deploy?',
                        parameters: [
                            [$class: 'ChoiceParameterDefinition',
                            choices: ['dev', 'main'].join('\n'),
                            name: 'Environment',
                            description: 'Environment to deploy to']
                        ])
                        if( "${USER_INPUT}" == "main"){
                            sh 'cd /home/ubuntu/jenkins/terraform && terraform init && terraform apply -auto-approve'
                        } else {
                            sh 'echo "DONE"'
                        }

                    }
                }
            }
        }
    }
}
