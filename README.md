# OpsPilot — Cloud Operations Dashboard

A polished dashboard frontend for a learning CI/CD project using GitHub, Jenkins, Docker, and Kubernetes.

## Run locally

```bash
npm test
npm start
```

Open http://localhost:3000

## Docker

```bash
docker build -t opspilot:local .
docker run --rm -p 3000:3000 -e APP_VERSION=local opspilot:local
```

Open http://localhost:3000. Health endpoint: http://localhost:3000/health

## Use with the existing CI/CD project

1. Replace your existing `server.js`, `package.json`, and `Dockerfile` with these files.
2. Keep your existing `Jenkinsfile` and `k8s/` manifests.
3. Ensure the Kubernetes deployment uses `containerPort: 3000` and its readiness/liveness probes use path `/` on port `3000`.
4. Set the `APP_VERSION` environment variable in the Deployment. Your Jenkins pipeline can replace a version placeholder with the build number.
5. Commit and push the changes to GitHub. Jenkins should build and deploy the updated image.

## Important accuracy note

The application version, process uptime, and HTTP health endpoint are runtime-derived. The pipeline stage cards, replica count, service health labels, and activity entries are illustrative UI content. Connect these areas to Jenkins and Kubernetes APIs/metrics before presenting them as live telemetry.
