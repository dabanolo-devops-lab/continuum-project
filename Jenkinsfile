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
        def scannerHome = tool 'SQ_Scanner';
        ECR_REPOSITORY = credentials('chat-ecr-repository')
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
                git branch: '${BRANCH_NAME}', credentialsId: 'github_continuum', url: 'https://github.com/dabanolo-devops-lab/continuum-project'
            }

        }

        stage('Test Build'){
            when {
                not{
                    branch 'main'
                }
            }
            steps{
                dir("./app"){
                    sh """#!/bin/bash -el
                    npm install
                    """.trim()
                }
            }
        }

        stage('Test'){
            when {
                not{
                    branch 'main'
                }
            }
            steps{
                dir("./app"){
                    sh """#!/bin/bash -el
                    npm test
                    """.trim()
                }
            }
        }

        stage('SonarQube Analysis') {
            when {
                not{
                    branch 'main'
                }
            }
            environment {
                SCANNER_HOME = tool 'SQ_Scanner';
            }
            steps {
                withSonarQubeEnv('SonarQube') {
                    
                    sh """#!/bin/bash -el
                    ls -las
                    ${SCANNER_HOME}/bin/sonar-scanner
                    """.trim()
                }
            }
        }
        
        stage('Quality Gate') {
            when {
                not{
                    branch 'main'
                }
            }
            steps {
                timeout(time: 1, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Create Build Version') {
            when {
                branch 'dev'
            }
            steps {
                sh 'echo "$(date +"%y.%m.%d")"."$(date +"%s" | cut -c6-10)" >> /home/ubuntu/jenkins/build_version'
            }
        }

        stage('Build Image') {
            when {
                branch 'dev'
            }
            environment{
                BUILD_VERSION = sh(script: """
                #!/bin/bash -el
                tail -n 1 /home/ubuntu/jenkins/build_version
                """, returnStdout: true).trim()
            }
            steps {
                sh 'docker build -t ${ECR_REPOSITORY}/chat-app:${BUILD_VERSION} -f prod.Dockerfile .'
            }
        }

        stage('Scan w/ Trivy') {
            when {
                branch 'dev'
            }
            environment{
                BUILD_VERSION = sh(script: """
                #!/bin/bash -el
                tail -n 1 /home/ubuntu/jenkins/build_version
                """, returnStdout: true).trim()

            }
            steps {
                sh """#!/bin/bash -el
                trivy image --format template --template "@contrib/junit.tpl" --output trivy-results.xml ${ECR_REPOSITORY}/chat-app:${BUILD_VERSION}
                """.trim()
            }
        }

        stage('Push to ECR') {
            when {
                branch 'main'
            }
            environment{
                BUILD_VERSION = sh(script: """
                #!/bin/bash -el
                tail -n 1 /home/ubuntu/jenkins/build_version
                """, returnStdout: true).trim()
            }
            steps {
                withAWS(region:'us-east-1',credentials:'aws_dabanolo'){
                    sh 'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${ECR_REPOSITORY}'
                    sh 'docker push ${ECR_REPOSITORY}/chat-app:${BUILD_VERSION}'
                }

            }
        }
        // stage('Task Config'){
        //     when {
        //         branch 'main'
        //     }
        //     environment{

        //         EXEC_ROLE = credentials('aws-exec-role')

        //         TASK_ROLE = credentials('aws-task-role')

        //         NAME = credentials('cluster-name')

        //         IMAGE = credentials('chat-ecr-repository')

        //         BUILD_VERSION = sh(script: """
        //         #!/bin/bash -el
        //         tail -n 1 /home/ubuntu/jenkins/build_version
        //         """, returnStdout: true).trim()

        //         LOG_GROUP = "/ecs/chat-app"


        //     }
        //     steps{
        //         sh 'rm /home/ubuntu/jenkins/terraform/main.tf'
        //         sh 'cp /home/ubuntu/jenkins/templates/main.tf /home/ubuntu/jenkins/terraform/main.tf'
        //         sh'''
        //         sed -i "s#1111111#${EXEC_ROLE}#g" /home/ubuntu/jenkins/terraform/main.tf
        //         sed -i "s#2222222#${TASK_ROLE}#g" /home/ubuntu/jenkins/terraform/main.tf
        //         sed -i "s#3333333#${NAME}#g" /home/ubuntu/jenkins/terraform/main.tf
        //         sed -i "s#4444444#${IMAGE}#g" /home/ubuntu/jenkins/terraform/main.tf
        //         sed -i "s#5555555#${BUILDV}#g" /home/ubuntu/jenkins/terraform/main.tf
        //         sed -i "s#0000000#${LOG_GROUP}#g" /home/ubuntu/jenkins/terraform/main.tf
        //         '''
        //     }
        // }

        stage('Deploy w/ Terraform') {

            environment{
                BUILDV = sh(script: "cat /home/ubuntu/jenkins/build_version", returnStdout: true).trim()
            }
            when {
                branch 'main'
            }
            steps {
                build 'Continuum Workflow/continuum-project-tf/main'
                
                // withAWS(region:'us-east-1',credentials:'aws_dabanolo'){
                //     script {
                //     def USER_INPUT = input(
                //         message: 'Which branch and environment do you want to deploy?',
                //         parameters: [
                //             [$class: 'ChoiceParameterDefinition',
                //             choices: ['dev', 'main'].join('\n'),
                //             name: 'Environment',
                //             description: 'Environment to deploy to']
                //         ])
                //         if( "${USER_INPUT}" == "main"){
                //             build job: 'deploy', parameters: [string(name: 'ENV', value: 'main')]
                //             sh 'cd /home/ubuntu/jenkins/terraform && terraform init && terraform apply -auto-approve'
                //         } else {
                //             sh 'echo "DONE"'
                //         }

                //     }
                // }
            }
        }
    }
    post {
        always {
            dir("./app"){
                junit allowEmptyResults: true, testResults: '*.xml'
            }
        }
    }
}
