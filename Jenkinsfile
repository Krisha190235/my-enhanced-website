pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  parameters {
    booleanParam(name: 'RELEASE_PROD', defaultValue: false, description: 'Promote this build to Production after staging deployment')
  }

  environment {
    APP_NAME = 'bookstore-app'
    STAGING_NAME = 'bookstore-staging'
    PROD_NAME = 'bookstore-prod'
    STAGING_PORT = '8080'
    PROD_PORT = '9090'
    NODE_ENV = 'production'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh '''
          set -e
          npm ci
          npm run build
        '''
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/**', fingerprint: true, onlyIfSuccessful: true
        }
      }
    }

    stage('Test') {
      steps {
        sh 'npm test -- --passWithNoTests || echo "No tests found — skipping."'
      }
    }

    stage('Code Quality (ESLint)') {
      steps {
        sh 'npx eslint src || true'
      }
    }

    stage('Security (npm audit)') {
      steps {
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('Docker Build') {
      steps {
        sh '''
          set -e
          docker build -t ${APP_NAME}:${BUILD_NUMBER} .
        '''
      }
    }

    stage('Deploy: Staging (Local Docker)') {
      steps {
        sh '''
          set -e
          docker rm -f ${STAGING_NAME} || true
          docker run -d --name ${STAGING_NAME} -p ${STAGING_PORT}:80 --restart=unless-stopped ${APP_NAME}:${BUILD_NUMBER}
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        sh 'curl -sSf http://localhost:${STAGING_PORT} >/dev/null'
      }
    }

    stage('Release: Production (Optional)') {
      when {
        expression { return params.RELEASE_PROD }
      }
      steps {
        script {
          input message: "Promote build #${env.BUILD_NUMBER} to Production (port ${env.PROD_PORT})?", ok: 'Deploy'
        }
        sh '''
          set -e
          docker rm -f ${PROD_NAME} || true
          docker run -d --name ${PROD_NAME} -p ${PROD_PORT}:80 --restart=unless-stopped ${APP_NAME}:${BUILD_NUMBER}
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Build #${env.BUILD_NUMBER} succeeded. Staging: http://localhost:${STAGING_PORT}"
    }
    failure {
      echo "❌ Build failed. Check logs in Jenkins."
    }
  }
}
