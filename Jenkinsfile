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
        sh 'docker build -f Dockerfile -t ${docker_tag}:1.0.0-${BUILD_ID} . '
      }
    }

    stage('Deploy to Hub') {
      steps {
        sh 'docker push ${docker_tag}:1.0.0-${BUILD_ID}'
      }
    }
    stage('set BuildID') {
      steps {
        sh('echo ${BUILD_ID} > buildID.txt')
      }
    }

  }
  environment {
    docker_tag = 'aetherbit/continuum'
  }
}