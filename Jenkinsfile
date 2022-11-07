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

  }
  environment {
    docker_tag = 'dabanolo/continuum'
  }
}