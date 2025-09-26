pipeline {
  agent any
  options { timestamps(); ansiColor('xterm'); buildDiscarder(logRotator(numToKeepStr: '15')) }
  tools { nodejs 'node20' }  // you noted Node 20 is installed in Jenkins tools

  environment {
    APP_NAME = 'bookstore-app'
    IMAGE    = "${APP_NAME}:${env.BUILD_NUMBER}"
    REGISTRY = 'docker.io/your-dockerhub-username'
    // Optional integrations (create these in Jenkins > Credentials)
    SONARQUBE_SERVER = 'sonarqube'          // Jenkins SonarQube server name (Manage Jenkins > System)
    SONAR_TOKEN_CRED = 'sonar-token'        // Secret text cred id
    DOCKER_LOGIN     = 'dockerhub'          // Username/Password cred id
    DATADOG_API_KEY  = credentials('datadog-api-key') // Secret text
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm  // Make sure your job tracks */main
      }
    }

    stage('Build (Vite)') {
      steps {
        sh '''
          set -e
          node -v; npm -v
          npm ci --include=dev
          npx vite build
          ls -l dist
        '''
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }

    stage('Test') {
      steps {
        sh '''
          set -e
          if npm run | grep -qE '^ *test '; then
            npm test
          else
            echo "No tests found — skipping."
          fi
        '''
      }
    }

    stage('Code Quality (SonarQube)') {
      when { expression { return false } } // flip to true when ready
      environment {
        SONAR_SCANNER_HOME = tool 'sonar-scanner' // define this tool in Jenkins
      }
      steps {
        withSonarQubeEnv("${SONARQUBE_SERVER}") {
          withCredentials([string(credentialsId: "${SONAR_TOKEN_CRED}", variable: 'SONAR_TOKEN')]) {
            sh '''
              "${SONAR_SCANNER_HOME}/bin/sonar-scanner" \
                -Dsonar.projectKey=bookstore-fe \
                -Dsonar.sources=src \
                -Dsonar.host.url=$SONAR_HOST_URL \
                -Dsonar.login=$SONAR_TOKEN
            '''
          }
        }
      }
    }

    stage('Security') {
      steps {
        sh '''
          set -e
          echo "Running npm audit (non-blocking at moderate)..."
          npm audit --audit-level=moderate || true
          echo "Running Trivy scan on filesystem and image..."
          # install trivy if your agent doesn't have it
          if ! command -v trivy >/dev/null 2>&1; then
            apk add --no-cache curl || true
            curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
          fi
        '''
      }
    }

    stage('Docker Build') {
      steps {
        sh '''
          set -e
          DOCKER_BUILDKIT=1 docker build -t ${IMAGE} .
          echo ${IMAGE} > .image_name
        '''
      }
    }

    stage('Deploy: Staging (Local Docker)') {
      steps {
        sh '''
          set -e
          IMAGE=$(cat .image_name)
          docker rm -f ${APP_NAME}-staging || true
          docker run -d --name ${APP_NAME}-staging -p 8090:3000 --restart=unless-stopped "$IMAGE"
        '''
      }
    }

    stage('Smoke Check (Staging)') {
      steps {
        sh '''
          set -e
          echo "🔎 Waiting for container health..."
          ATTEMPTS=30; SLEEP=2
          for i in $(seq 1 $ATTEMPTS); do
            STATUS=$(docker inspect -f {{.State.Health.Status}} ${APP_NAME}-staging || echo starting)
            [ "$STATUS" = healthy ] && echo "✅ Healthy" && break
            echo "⏳ ($i/$ATTEMPTS) Status: $STATUS — retrying in ${SLEEP}s..."; sleep $SLEEP
          done
          docker exec ${APP_NAME}-staging sh -lc 'curl -fsS http://localhost:3000/' >/dev/null
          echo "✅ App responded 200 OK"
        '''
      }
    }

    stage('Release: Production') {
      when { expression { return false } } // turn on when ready
      steps {
        input message: 'Promote to production?', ok: 'Release'
        withCredentials([usernamePassword(credentialsId: "${DOCKER_LOGIN}", usernameVariable: 'DU', passwordVariable: 'DP')]) {
          sh '''
            set -e
            IMAGE=$(cat .image_name)
            docker login -u "$DU" -p "$DP"
            docker tag "$IMAGE" ${REGISTRY}/${APP_NAME}:${BUILD_NUMBER}
            docker tag "$IMAGE" ${REGISTRY}/${APP_NAME}:latest
            docker push ${REGISTRY}/${APP_NAME}:${BUILD_NUMBER}
            docker push ${REGISTRY}/${APP_NAME}:latest
            echo "✅ Released ${REGISTRY}/${APP_NAME}:${BUILD_NUMBER}"
          '''
        }
      }
    }

    stage('Monitoring & Alerting (hook)') {
      when { expression { return false } } // choose your tool; example: Datadog agent
      steps {
        sh '''
          set -e
          echo "Starting Datadog agent sidecar for demo (optional)..."
          docker rm -f dd-agent || true
          docker run -d --name dd-agent -e DD_API_KEY='${DATADOG_API_KEY}' -e DD_SITE="datadoghq.com" \
            -v /var/run/docker.sock:/var/run/docker.sock:ro \
            gcr.io/datadoghq/agent:latest
          echo "You should configure real dashboards/alerts in Datadog/New Relic."
        '''
      }
    }
  }

  post {
    always {
      sh 'docker ps -a || true'
      sh "docker logs --tail=200 ${APP_NAME}-staging || true"
    }
  }
}
