pipeline {
  agent any

  environment {
    GIT_REPO_URL = 'https://github.com/adityacreditdharma/practice-app.git'
    GIT_BRANCH = 'main'

    // Jenkins → Credentials → Secret file: upload SA JSON, ID: gcp-sa-json

    // Project where Artifact Registry + GKE cluster live (grant the SA roles on this project)
    PROJECT_ID = 'project-5cb55985-b2f0-469c-8cb'
    REGION = 'asia-south1'
    AR_HOST = "${REGION}-docker.pkg.dev"
    AR_REPO = 'node-repo'
    IMAGE_NAME = 'hello-gke-node'

    CLUSTER_NAME = 'hello-gke-cluster'
    CLUSTER_ZONE = 'asia-south1-b'

    DEPLOYMENT_NAME = 'hello-gke-deployment'
    CONTAINER_NAME = 'hello-gke-node'

    // GKE kubectl auth (needs gke-gcloud-auth-plugin + kubectl on the agent PATH)
    USE_GKE_GCLOUD_AUTH_PLUGIN = 'True'
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: "${GIT_BRANCH}", credentialsId: 'github-creds', url: "${GIT_REPO_URL}"
      }
    }

    stage('GCP & Docker login') {
      steps {
        withCredentials([file(credentialsId: 'gcp-sa-json', variable: 'GCP_SA_KEY')]) {
          sh '''
            set -e
            if ! command -v docker >/dev/null 2>&1; then
              echo "ERROR: docker not found on this Jenkins agent."
              exit 127
            fi
            gcloud auth activate-service-account --key-file="$GCP_SA_KEY"
            gcloud config set project "$PROJECT_ID"
            gcloud auth configure-docker "${REGION}-docker.pkg.dev" -q
          '''
        }
      }
    }

    stage('Build & push image') {
      steps {
        script {
          env.IMAGE_URI = "${AR_HOST}/${PROJECT_ID}/${AR_REPO}/${IMAGE_NAME}:${BUILD_NUMBER}"
        }
        sh '''
          docker build -t "$IMAGE_URI" .
          docker push "$IMAGE_URI"
        '''
      }
    }

    stage('Deploy to GKE') {
      steps {
        withCredentials([file(credentialsId: 'gcp-sa-json', variable: 'GCP_SA_KEY')]) {
          sh '''
            set -e
            gcloud auth activate-service-account --key-file="$GCP_SA_KEY"
            gcloud config set project "$PROJECT_ID"
            gcloud container clusters get-credentials "$CLUSTER_NAME" \
              --zone="$CLUSTER_ZONE" --project="$PROJECT_ID"
            kubectl set image "deployment/$DEPLOYMENT_NAME" \
              "$CONTAINER_NAME=$IMAGE_URI"
            kubectl rollout status "deployment/$DEPLOYMENT_NAME" --timeout=180s
          '''
        }
      }
    }
  }
}
