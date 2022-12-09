def COLOR_MAP = [
    'SUCCESS': 'good', 
    'FAILURE': 'danger',
]

pipeline {

    agent 'node'

    environment {
        TESTING =""
    }

    options {
        ansiColor('xterm')
    }

    // agent {
    //     node {
    //         label 'node'
    //     }
    // }

    stages {
        
        stage('Checkout Sources') {
            steps {
                // git branch: 'dev', credentialsId: 'jenkins-dabanolo-continuum', url: 'https://github.com/dabanolo-devops-lab/continuum-project'
                sh 'echo "Hello World"'
            }
        }
    
        stage('Build') {
            steps {
                sh 'docker images prune'
                sh 'docker build -t testing .'
                sh 'docker tag testing:latest dabanolo/testing:latest'
            }
        }
        
        stage('Unit Testing') {
            steps {
                sh 'docker run --tty dabanolo/testing:latest npm test'
            }
        }

        stage('Scan w/ Trivy') {
            steps {
                sh 'trivy image dabanolo/testing:latest'
            }
        }
            // stage('Scan w/ Anchore') {
            //     steps {
            //         sh 'grype dabanolo/testing:latest --scope all-layers'
            //     }
            // }
        stage('Deploy'){
            steps {
                input message: 'Which branch and environment do you want to deploy?',
                parameters: [
                choice(name: 'BRANCH', choices: ['master', 'dev'], description: 'Branch'),
                choice(name: 'ENVIRONMENT', choices: ['prod', 'staging'], description: 'Environment')
                ]
            }
        }
    }
}
