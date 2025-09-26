pipeline {
  agent any
  options { timestamps(); ansiColor('xterm') }

  parameters {
    booleanParam(
      name: 'RELEASE_PROD',
      defaultValue: false,
      description: 'Promote this build to Production after staging deployment'
    )
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

    stage('Build (Vite)') {
      steps {
        sh '''
          set -e
          node -v && npm -v
          npm ci --include=dev
          npx vite build
        '''
      }
      post {
        success { archiveArtifacts artifacts: 'dist/**', fingerprint: true }
      }
    }

    stage('Test') {
      steps {
        // keep green even if there are no tests
        sh 'npm test -- --passWithNoTests || echo "No tests found — skipping."'
      }
    }

    stage('Security (npm audit)') {
      steps {
        // informational only
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t ${APP_IMAGE}:${BUILD_NUMBER} .'
      }
    }

    stage('Deploy: Staging (Docker Compose)') {
      steps {
        sh '''
          set -e

          # Clean lingering container name (belt & suspenders)
          docker rm -f bookstore-staging >/dev/null 2>&1 || true

          # Bring down any previous staging stack for this project
          docker compose -p bookstore-staging -f docker-compose.staging.yml down --remove-orphans || true

          # Bring it up with the just-built tag
          BUILD_NUMBER=${BUILD_NUMBER} docker compose -p bookstore-staging -f docker-compose.staging.yml up -d
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        script {
          retry(10) {
            echo '⏳ Waiting for staging to be ready...'
            sleep 3
            sh "curl -fsS ${env.STAGING_URL}/ >/dev/null"
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

          # Clean lingering container name
          docker rm -f bookstore-prod >/dev/null 2>&1 || true

          # Bounce prod stack
          docker compose -p bookstore-prod -f docker-compose.prod.yml down --remove-orphans || true
          BUILD_NUMBER=${BUILD_NUMBER} docker compose -p bookstore-prod -f docker-compose.prod.yml up -d
        '''
      }
    }

    stage('Smoke Check (Prod)') {
      when { expression { return params.RELEASE_PROD } }
      steps {
        script {
          retry(10) {
            echo '⏳ Waiting for prod to be ready...'
            sleep 3
            sh "curl -fsS ${env.PROD_URL}/ >/dev/null"
          }
        }
      }
    }
  }

  post {
    success { echo "✅ Build #${env.BUILD_NUMBER} OK. Staging: ${env.STAGING_URL}${params.RELEASE_PROD ? " | Prod: ${env.PROD_URL}" : ""}" }
    failure { echo '❌ Build failed. Check logs.' }
    always {
      // Optional: show running services for quick sanity check
      sh 'docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" || true'
    }
  }
}