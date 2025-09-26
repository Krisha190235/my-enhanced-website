pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
  }

  tools {
    nodejs 'node20'   // Your Jenkins NodeJS tool name
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
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
          echo "🔎 Waiting for container health (bookstore-staging)..."
          ATTEMPTS=30
          SLEEP=2
          for i in $(seq 1 "$ATTEMPTS"); do
            STATUS="$(docker inspect -f '{{.State.Health.Status}}' bookstore-staging 2>/dev/null || echo starting)"
            if [ "$STATUS" = "healthy" ]; then
              echo "✅ Container is healthy"
              # Sanity check FROM INSIDE the container to avoid host/localhost confusion
              docker exec bookstore-staging sh -lc 'curl -fsS http://localhost:3000/ >/dev/null'
              echo "✅ App responded to internal curl"
              exit 0
            fi
            echo "⏳ ($i/$ATTEMPTS) Status: $STATUS — retrying in ${SLEEP}s..."
            sleep "$SLEEP"
          done
          echo "❌ App did not become healthy in time. Showing last logs:"
          docker logs --tail=200 bookstore-staging || true
          exit 1
        '''
      }
    }

    stage('Release: Production (Optional)') {
      when { expression { false } } // enable later if/when needed
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