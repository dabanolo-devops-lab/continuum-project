pipeline {
  agent {
    node {
      label 'Node'
    }

  }
  stages {
    stage('Checkout code') {
      steps {
        sh("echo 'OK'")
      }
    }

  }
  environment {
    docker_tag = 'aetherbit/continuum'
  }
}