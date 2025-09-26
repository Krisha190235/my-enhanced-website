pipeline {
  agent any
  options { timestamps(); ansiColor('xterm') }

  parameters {
    booleanParam(name: 'RELEASE_PROD', defaultValue: false,
      description: 'Promote this build to Production after staging deployment')
  }

  environment {
    STAGING_URL = 'http://localhost:8090'
    PROD_URL    = 'http://localhost:9090'
    APP_IMAGE   = 'bookstore-app'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Docker Build (includes Vite build)') {
      steps { sh 'docker build -t ${APP_IMAGE}:${BUILD_NUMBER} .' }
    }

    stage('Deploy: Staging (Docker Compose)') {
      steps {
        sh '''
          set -e
          docker compose -f docker-compose.staging.yml down || true
          BUILD_NUMBER='${BUILD_NUMBER}' docker compose -f docker-compose.staging.yml up -d
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        script {
          retry(5) {
            echo '⏳ Waiting for app to be ready...'
            sleep 5
            sh "curl -fsS ${env.STAGING_URL} >/dev/null"
          }
        }
      }
    }

    stage('Release: Production (Optional)') {
      when { expression { return params.RELEASE_PROD } }
      steps {
        script {
          input message: "Promote build #${env.BUILD_NUMBER} to Production (${env.PROD_URL})?", ok: 'Deploy'
        }
        sh '''
          set -e
          docker compose -f docker-compose.prod.yml down || true
          BUILD_NUMBER='${BUILD_NUMBER}' docker compose -f docker-compose.prod.yml up -d
        '''
      }
    }

    stage('Smoke Check (Prod)') {
      when { expression { return params.RELEASE_PROD } }
      steps { sh "curl -fsS ${env.PROD_URL} >/dev/null" }
    }
  }

  post {
    success { echo "✅ Build #${env.BUILD_NUMBER} OK. Staging: ${env.STAGING_URL}" }
    failure { echo "❌ Build failed. Check logs." }
  }
}
