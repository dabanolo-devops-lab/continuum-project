pipeline {
  agent {
    node {
      label 'Node'
    }

  }
  stages {
    stage('Checkout code') {
      steps {
        git(url: 'https://github.com/dabanolo-devops-lab/continuum-project', branch: 'main')
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -f Dockerfile -t 210220393398.dkr.ecr.us-east-2.amazonaws.com/${DOCKER_TAG}:1.0.0-${BUILD_ID} . '
      }
    }

    stage('Deploy to Hub') {
      steps {
        sh 'docker push 210220393398.dkr.ecr.us-east-2.amazonaws.com/${DOCKER_TAG}:1.0.0-${BUILD_ID}'
      }
    }
    stage('set BuildID') {
      steps {
        sh('echo ${BUILD_ID} > /home/ubuntu/jenkins/buildID.txt')
      }
    }

  }
  environment {
    DOCKER_TAG = 'continuum-app'
  }
}