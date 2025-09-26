pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    // Use your Jenkins NodeJS tool named "node20"
    NODEJS_HOME = tool name: 'node20', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    PATH = "${NODEJS_HOME}/bin:${PATH}"
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
          ls -l dist
        '''
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/**,dist/index.html', fingerprint: true
        }
      }
    }

    stage('Test (Optional)') {
      steps {
        sh '''
          if npm run | grep -qE '^ *test '; then
            npm test -- --passWithNoTests
          else
            echo "No tests found — skipping."
          fi
        '''
      }
    }

    stage('Lint (Optional)') {
      steps {
        sh '''
          if [ -f eslint.config.js ] || [ -f eslint.config.cjs ] || [ -f eslint.config.mjs ]; then
            npx eslint src || true
          else
            echo "No ESLint config (eslint.config.js) — skipping."
          fi
        '''
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
          IMAGE="bookstore-app:${BUILD_NUMBER}"
          docker build -t "$IMAGE" .
          echo "$IMAGE" > .image_name
        '''
      }
    }

    stage('Deploy: Staging (Local Docker)') {
      steps {
        sh '''
          set -e
          IMAGE="$(cat .image_name)"
          docker rm -f bookstore-staging || true
          docker run -d --name bookstore-staging -p 8090:3000 --restart=unless-stopped "$IMAGE"
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        sh '''
          set -e
          echo "🔎 Waiting for http://localhost:8090 to be ready..."
          ATTEMPTS=30
          SLEEP=2
          URL="http://localhost:8090"
          for i in $(seq 1 "$ATTEMPTS"); do
            if curl -fsSL "$URL/" >/dev/null; then
              echo "✅ App is up"
              exit 0
            fi
            echo "⏳ ($i/$ATTEMPTS) Not ready yet, sleeping ${SLEEP}s..."
            sleep "$SLEEP"
          done
          echo "❌ App did not become ready in time. Showing last logs:"
          docker logs --tail=200 bookstore-staging || true
          exit 1
        '''
      }
    }

    stage('Release: Production (Optional)') {
      when { expression { false } } // enable later if needed
      steps {
        echo 'Production release step is disabled for now.'
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f || true'
      sh 'docker container prune -f || true'
      sh 'docker ps -a || true'
      sh 'docker logs --tail=200 bookstore-staging || true'
    }
    failure {
      echo '❌ Build failed. Check logs in Jenkins.'
    }
  }
}