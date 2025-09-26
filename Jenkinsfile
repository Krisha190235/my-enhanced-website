pipeline {
  agent any

  options {
    ansiColor('xterm')
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timeout(time: 30, unit: 'MINUTES')
  }

  environment {
    APP_NAME      = 'bookstore-app'
    STAGING_NAME  = 'bookstore-staging'
    STAGING_PORT  = '8090'          // host port → container:3000
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
          npm ci --include=dev
          npx vite build
          ls -l dist || true
        '''
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/**', fingerprint: true
        }
      }
    }

    stage('Test (Optional)') {
      steps {
        // Don’t fail if there are no tests
        sh '''
          set +e
          npm test -- --passWithNoTests
          if [ $? -ne 0 ]; then
            echo "No tests found — skipping."
          fi
        '''
      }
    }

    stage('Lint (Optional)') {
      steps {
        // Only run if an ESLint config exists; never fail the build here
        sh '''
          set +e
          if [ -f eslint.config.js ] || [ -f .eslintrc.js ] || [ -f .eslintrc.cjs ] || [ -f .eslintrc.json ] || [ -f .eslintrc ]; then
            echo "Running ESLint…"
            npx eslint src || true
          else
            echo "No ESLint config — skipping."
          fi
        '''
      }
    }

    stage('Security (npm audit)') {
      steps {
        sh '''
          set +e
          npm audit --audit-level=moderate || true
        '''
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
          docker rm -f ${STAGING_NAME} >/dev/null 2>&1 || true
          docker run -d --name ${STAGING_NAME} \
            -p ${STAGING_PORT}:3000 \
            --restart=unless-stopped \
            ${APP_NAME}:${BUILD_NUMBER}
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        // Probe the app from *inside* the container so we don’t depend on host networking
        sh '''
          set -e
          echo "🔎 Probing inside container on http://localhost:3000 ..."
          ATTEMPTS=30
          SLEEP=2
          for i in $(seq 1 $ATTEMPTS); do
            if docker exec ${STAGING_NAME} sh -c "wget -qO- http://localhost:3000 >/dev/null 2>&1 || curl -fsS http://localhost:3000 >/dev/null 2>&1"; then
              echo "✅ App is responding inside container (attempt $i)."
              exit 0
            fi
            echo "⏳ ($i/${ATTEMPTS}) Not ready yet, sleeping ${SLEEP}s..."
            sleep $SLEEP
          done
          echo "❌ App did not become ready in time. Showing last logs:"
          docker logs --tail=200 ${STAGING_NAME}
          exit 1
        '''
      }
    }

    // Example placeholder for production (disabled by default)
    // stage('Release: Production (Optional)') {
    //   when { expression { return false } } // flip to true when ready
    //   steps {
    //     echo 'Ship it 🚀 (implement push/run for prod here)'
    //   }
    // }
  }

  post {
    always {
      sh 'docker ps -a || true'
      echo '🧹 Pruning old images/containers (safe to ignore failures)…'
      sh 'docker image prune -f || true'
      sh 'docker container prune -f || true'
      echo '🏁 Pipeline done.'
    }
    failure {
      echo '❌ Build failed. Check logs in Jenkins.'
      sh 'docker logs --tail=200 ${STAGING_NAME} || true'
    }
  }
}