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
        office365ConnectorWebhooks([[
            name: 'Teams-JK-Alerts',
            startNotification: true,
            url: 'https://unaledu.webhook.office.com/webhookb2/ceab6fb2-ca5b-4d5d-9885-b7bcc5299c0e@577fc1d8-0922-458e-87bf-ec4f455eb600/IncomingWebhook/7cc7c93a924e499e92024375cff65836/95e094a2-b2d3-4dff-a40c-47b9fe3f5404'
        ]])
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
                sh 'echo "$(date +"%y.%m.%d")"."$(date +"%H%M%S")" >> /home/ubuntu/jenkins/build_version'
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
                sh 'docker build -t ${ECR_REPOSITORY}:${BUILD_VERSION} -f prod.Dockerfile .'
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
                trivy image --format template --template "/home/ubuntu/jenkins/tools/junit.tpl" --output trivy-results.xml ${ECR_REPOSITORY}:${BUILD_VERSION}
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
                    sh 'docker push ${ECR_REPOSITORY}:${BUILD_VERSION}'
                }

            }
        }

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
        success {
            office365ConnectorSend webhookUrl: "https://unaledu.webhook.office.com/webhookb2/ceab6fb2-ca5b-4d5d-9885-b7bcc5299c0e@577fc1d8-0922-458e-87bf-ec4f455eb600/IncomingWebhook/7cc7c93a924e499e92024375cff65836/95e094a2-b2d3-4dff-a40c-47b9fe3f5404",
                factDefinitions: [[name: "Branch", template: "${BRANCH_NAME}"],
                                  [name: "Job", template: "${JOB_NAME}"]]
        }
        aborted {
            office365ConnectorSend webhookUrl: "https://unaledu.webhook.office.com/webhookb2/ceab6fb2-ca5b-4d5d-9885-b7bcc5299c0e@577fc1d8-0922-458e-87bf-ec4f455eb600/IncomingWebhook/6ad2005726044cb7879331c7537f6804/95e094a2-b2d3-4dff-a40c-47b9fe3f5404",
                factDefinitions: [[name: "Branch", template: "${BRANCH_NAME}"],
                                  [name: "Job", template: "${JOB_NAME}"]]
        }
        failure {
            office365ConnectorSend webhookUrl: "https://unaledu.webhook.office.com/webhookb2/ceab6fb2-ca5b-4d5d-9885-b7bcc5299c0e@577fc1d8-0922-458e-87bf-ec4f455eb600/IncomingWebhook/e26dfa085e4c48d7b68a5f81011e63e9/95e094a2-b2d3-4dff-a40c-47b9fe3f5404",
                factDefinitions: [[name: "Branch", template: "${BRANCH_NAME}"],
                                  [name: "Job", template: "${JOB_NAME}"]]
        }
    }
}
