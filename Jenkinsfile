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
        sh 'docker build -f continuum-project_main/Docker/Dockerfile -t ${docker_tag}:1.0.0-${BUILD_ID} continuum-project_main '
      }
    }

  }
  environment {
    docker_tag = 'dabanolo/continuum'
  }
}