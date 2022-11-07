pipeline {
  agent {
    node {
      label 'Node'
    }

  }
  stages {
    stage('get buildID') {
        steps {
            script {
                buildJob = sh(script: cat ../pull-to-instance/buildID.txt, returnStdout: true).trim()
            }
        }
    }
    stage('SSH to remote host') {
      steps {
        sshagent(['jenkins-ssh']) {
        //   sh('ssh -o StrictHostKeyChecking=no -i ~/.ssh/delta_key ubuntu@${remote_host} "docker pull ${docker_tag}:1.0.0-${BUILD_ID}"')
        //   sh('ssh -o StrictHostKeyChecking=no -i ~/.ssh/delta_key delta@${remote_host} "docker pull ${docker_tag}:1.0.0-${BUILD_ID}"')
        sh('ssh -o StrictHostKeyChecking=no -i ~/.ssh/delta_key delta@${remote_host} "echo ${buildJob}"')
        }
      }
    }

  }
  environment {
    docker_tag = 'aetherbit/continuum'
    remote_host = credentials('delta-ip')
    buildJob = ''
  }
}

ssh -i ~/.ssh/delta_key  delta@