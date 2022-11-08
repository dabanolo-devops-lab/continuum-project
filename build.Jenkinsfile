pipeline {
  agent {
    node {
      label 'Node'
    }
  }
  environment {
    DOCKER_TAG = 'continuum-app'
    CONTAINER_NAME = 'continuum-project'
    REMOTE_HOST = credentials('REMOTE_CONTAINER')
    KEY_PATH = credentials('key-dir')
    BUILD_ID = sh(script: "cat /home/ubuntu/jenkins/buildID.txt", returnStdout: true).trim()
  }
  stages {
    stage('Pull image') {
      steps {
        sshagent(['jenkins-ssh']) {
          sh('ssh -o StrictHostKeyChecking=no -i ${KEY_PATH} ${REMOTE_HOST} "docker kill $(docker ps -q) 2>/dev/null && echo $? && docker system prune -a -f && docker pull 210220393398.dkr.ecr.us-east-2.amazonaws.com/${DOCKER_TAG}:1.0.0-${BUILD_ID} && docker run --name ${CONTAINER_NAME} -p 80:8080 -p 3000:3000 -d 210220393398.dkr.ecr.us-east-2.amazonaws.com/${DOCKER_TAG}:1.0.0-${BUILD_ID}"')
        }
      }
    }
  }
}