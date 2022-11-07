pipeline {
  agent {
    node {
      label 'Node'
    }
  }
  environment {
    docker_tag = 'aetherbit/continuum'
    remote_host = credentials('delta-ip')
    buildJob = sh(script: "cat ~/buildID.txt", returnStdout: true).trim()
  }
  stages {
    stage('Pull image') {
      steps {
        sshagent(['jenkins-ssh']) {
        //   sh('ssh -o StrictHostKeyChecking=no -i ~/.ssh/delta_key ubuntu@${remote_host} "docker pull ${docker_tag}:1.0.0-${BUILD_ID}"')
          sh('ssh -o StrictHostKeyChecking=no -i ~/.ssh/delta_key delta@${remote_host} "docker pull ${docker_tag}:1.0.0-${buildJob} && docker run --name ${docker_tag} -p 80:3000 -d ${docker_tag}:1.0.0-${buildJob}"')
        }
      }
    }
  }
}