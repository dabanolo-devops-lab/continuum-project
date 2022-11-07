pipeline {
  agent {
    node {
      label 'Node'
    }

  }
  stages {
    stage('SSH target') {
      steps {
        sh 'echo "OK"'
      }
    }

  }
  environment {
    docker_tag = 'aetherbit/continuum'
  }
}