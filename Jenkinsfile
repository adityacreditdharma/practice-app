pipeline {
  agent any

  environment {
    PROJECT_ID = 'project-5cb55985-b2f0-469c-8cb'
    REGION = 'asia-south1'
    AR_HOST = "${REGION}-docker.pkg.dev"
    AR_REPO = 'node-repo'
    IMAGE_NAME = 'hello-gke-node'

    CLUSTER_NAME = 'hello-gke-cluster'
    CLUSTER_ZONE = 'asia-south1-b'

    DEPLOYMENT_NAME = 'hello-gke-deployment'
    CONTAINER_NAME = 'hello-gke-node'
  }

  stages {
    stage('Checkout') {
      steps {
        // Job → Pipeline script from SCM → Git: set Credentials to "github-creds"
        checkout scm
      }
    }

    stage('GCP & Docker login') {
      steps {
        withCredentials([string(credentialsId: 'gcp-token', variable: 'GCP_SA_JSON')]) {
          sh '''
            printf '%s\n' "$GCP_SA_JSON" > "$WORKSPACE/gcp-sa.json"
            gcloud auth activate-service-account --key-file="$WORKSPACE/gcp-sa.json"
            rm -f "$WORKSPACE/gcp-sa.json"
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
        dir('practice') {
          sh '''
            docker build -t "$IMAGE_URI" .
            docker push "$IMAGE_URI"
          '''
        }
      }
    }

    stage('Deploy to GKE') {
      steps {
        sh '''
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
