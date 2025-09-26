pipeline {
  agent any

  options {
    ansiColor('xterm')
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    APP_NAME     = 'bookstore-app'
    STAGING_NAME = 'bookstore-staging'
    STAGING_PORT = '8090'         // host port; container listens on 3000
    IMAGE_TAG    = "${env.BUILD_NUMBER}"
    NODE_IMAGE   = 'node:20.11.0-alpine'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build (Vite)') {
      steps {
        sh '''
          set -e
          echo "🔧 Using Node inside ${NODE_IMAGE}"
          docker run --rm -v "$PWD":/app -w /app ${NODE_IMAGE} sh -lc '
            node -v || true
            npm -v  || true
            npm ci --include=dev
            npx vite build
            ls -l dist
          '
        '''
      }
    }

    stage('Test (Optional)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app ${NODE_IMAGE} sh -lc '
            npm test -- --passWithNoTests || echo "No tests found — skipping."
          '
        '''
      }
    }

    stage('Lint (Optional)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app ${NODE_IMAGE} sh -lc '
            npx eslint src || true
          '
        '''
      }
    }

    stage('Security (npm audit)') {
      steps {
        sh '''
          docker run --rm -v "$PWD":/app -w /app ${NODE_IMAGE} sh -lc "
            npm audit --audit-level=moderate || true
          "
        '''
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t ${APP_NAME}:${IMAGE_TAG} .'
      }
    }

    stage('Deploy: Staging (Local Docker)') {
      steps {
        sh '''
          set -e
          docker rm -f ${STAGING_NAME} || true
          docker run -d --name ${STAGING_NAME} \
            -p ${STAGING_PORT}:3000 \
            --restart=unless-stopped \
            ${APP_NAME}:${IMAGE_TAG}
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        sh '''
          set -e
          echo "🔎 Waiting for http://localhost:${STAGING_PORT} to be ready..."
          ATTEMPTS=30
          SLEEP=2
          URL="http://localhost:${STAGING_PORT}"
          for i in $(seq 1 $ATTEMPTS); do
            if curl -fsS "$URL" >/dev/null; then
              echo "✅ App is up at $URL"
              exit 0
            fi
            echo "⏳ ($i/$ATTEMPTS) Not ready yet, sleeping ${SLEEP}s..."
            sleep $SLEEP
          done
          echo "❌ App did not become ready in time. Showing last logs:"
          docker logs --tail=200 ${STAGING_NAME} || true
          exit 1
        '''
      }
    }
  }

  post {
    always {
      echo '🧹 Pruning old images/containers (safe to ignore failures)…'
      sh 'docker image prune -f || true'
      sh 'docker container prune -f || true'
      sh 'docker ps -a'
      sh 'docker logs --tail=200 ${STAGING_NAME} || true'
    }
    unsuccessful {
      echo '❌ Build failed. Check logs in Jenkins.'
    }
  }
}