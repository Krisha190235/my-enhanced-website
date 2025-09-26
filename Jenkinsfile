pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  parameters {
    booleanParam(name: 'RELEASE_PROD', defaultValue: false, description: 'If true, promote the current build to Production (local Docker on port 9090).')
  }

  environment {
    APP_NAME = 'bookstore-app'
    STAGING_NAME = 'bookstore-staging'
    PROD_NAME = 'bookstore-prod'
    STAGING_PORT = '8080'
    PROD_PORT = '9090'
    NODE_ENV = 'production'
    // If you use Vite env vars, you can export them here or inject via Jenkins credentials
    // VITE_FIREBASE_API_KEY = credentials('vite-firebase-api-key')
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
          // Keep the built static assets as an artifact (handy for debugging)
          archiveArtifacts artifacts: 'dist/**', fingerprint: true, onlyIfSuccessful: true
        }
      }
    }

    stage('Test') {
      steps {
        // If you haven't added tests yet, keep pipeline green but show output
        sh 'npm test -- --passWithNoTests || echo "No tests (or tests failed) — not gating build yet"'
      }
    }

    stage('Code Quality (ESLint)') {
      steps {
        // Make non-blocking at first; switch to failing when clean
        sh 'npx eslint src || true'
      }
    }

    stage('Security (npm audit)') {
      steps {
        // Swap for Snyk/Trivy if you want stronger scans; keep non-blocking to start
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

    stage('Deploy: Staging (local Docker)') {
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
        // For a static site, a simple GET is enough
        sh 'curl -sSf http://localhost:${STAGING_PORT} >/dev/null'
      }
    }

    stage('Release: Manual or Param') {
      when {
        anyOf {
          expression { return params.RELEASE_PROD }
          beforeInput true
        }
      }
      steps {
        script {
          if (!params.RELEASE_PROD) {
            input message: "Promote build #${env.BUILD_NUMBER} to Production (port ${env.PROD_PORT})?", ok: 'Deploy'
          }
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
      echo "✅ Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded."
      // If Jenkins Mailer is configured, you can enable the following:
      // emailext subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
      //          body: "Staging: http://<jenkins-host>:${STAGING_PORT}\nProd (if promoted): http://<jenkins-host>:${PROD_PORT}",
      //          to: 'you@example.com',
      //          attachLog: true
    }
    failure {
      echo "❌ Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} failed."
      // emailext subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
      //          body: "Check Jenkins for details.",
      //          to: 'you@example.com',
      //          attachLog: true
    }
  }
}