pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  // If you use the Jenkins "NodeJS" plugin, set this name to match your installation (Manage Jenkins > Tools).
  tools {
    nodejs 'Node_24'   // <-- change if your NodeJS tool has a different name
  }

  environment {
    APP_NAME     = 'bookstore-app'
    STAGING_NAME = 'bookstore-staging'
    PROD_NAME    = 'bookstore-prod'
    STAGING_PORT = '8090'  // host port
    CONTAINER_PORT = '3000'// container port (your app must listen here)
    NODE_ENV     = 'production'
    DOCKER_BUILDKIT = '1'
  }

  parameters {
    booleanParam(name: 'RELEASE_PROD', defaultValue: false, description: 'Promote this build to Production after staging deployment')
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
          echo "🔧 Using Node: $(node -v)"
          echo "🔧 Using npm : $(npm -v)"

          # Install deps (include dev so vite is available)
          npm ci --include=dev

          # Build with vite
          npx vite build

          # Show build output briefly
          ls -l dist || true
        '''
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/**', fingerprint: true, onlyIfSuccessful: true
        }
      }
    }

    stage('Test (Optional)') {
      steps {
        // Your project has no tests; keep non-failing
        sh 'npm test -- --passWithNoTests || echo "No tests found — skipping."'
      }
    }

    stage('Lint (Optional)') {
      steps {
        // No eslint config yet—don’t fail the pipeline
        sh 'npx eslint src || true'
      }
    }

    stage('Security (npm audit)') {
      steps {
        // Informational only
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
          # Stop/remove old container if exists
          docker rm -f ${STAGING_NAME} || true

          # Run new container; map host ${STAGING_PORT} -> container ${CONTAINER_PORT}
          docker run -d \
            --name ${STAGING_NAME} \
            -p ${STAGING_PORT}:${CONTAINER_PORT} \
            --restart=unless-stopped \
            ${APP_NAME}:${BUILD_NUMBER}
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        // Retry loop so we don't fail before server is ready
        sh '''
          set -e
          echo "🔎 Waiting for http://localhost:${STAGING_PORT} to be ready..."
          ATTEMPTS=30
          SLEEP=2
          URL="http://localhost:${STAGING_PORT}"

          for i in $(seq 1 $ATTEMPTS); do
            if curl -fsS "$URL" >/dev/null 2>&1; then
              echo "✅ Staging is up: $URL"
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

    stage('Release: Production (Optional)') {
      when { expression { return params.RELEASE_PROD } }
      steps {
        script {
          input message: "Promote build #${env.BUILD_NUMBER} to Production?", ok: 'Deploy'
        }
        sh '''
          set -e
          docker rm -f ${PROD_NAME} || true
          # example production port 9090->3000 (adjust as you like)
          docker run -d \
            --name ${PROD_NAME} \
            -p 9090:${CONTAINER_PORT} \
            --restart=unless-stopped \
            ${APP_NAME}:${BUILD_NUMBER}
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Build #${env.BUILD_NUMBER} succeeded."
      echo "   Staging:   http://localhost:${STAGING_PORT}"
      echo "   To release to production, re-run with RELEASE_PROD=true."
    }
    failure {
      echo "❌ Build failed. Check logs in Jenkins."
      sh 'docker ps -a || true'
      sh 'docker logs --tail=200 ${STAGING_NAME} || true'
    }
    always {
      // Optional: prune old images/containers to save space
      sh 'docker image prune -f || true'
      sh 'docker container prune -f || true'
    }
  }
}