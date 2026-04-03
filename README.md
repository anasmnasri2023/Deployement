<div align="center">

# 🎓 E-Learning Platform

### Full-stack e-learning application — React · Node.js · DevOps

[![CI](https://github.com/anasmnasri2023/e-learning/actions/workflows/ci.yml/badge.svg)](https://github.com/anasmnasri2023/e-learning/actions)
[![Quality Gate](https://img.shields.io/badge/SonarQube-passing-brightgreen)](sonar-project.properties)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-deployed-326CE5?logo=kubernetes&logoColor=white)](kubernetes/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=white)]()
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)]()

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Infrastructure](#-infrastructure)
- [Code Quality](#-code-quality)
- [Contributing](#-contributing)

---

## 🧭 Overview

**E-Learning Platform** is a modern web application built with **React** on the frontend and **Node.js** on the backend. It enables online course delivery, user management, and content tracking through a clean REST API.

The project is fully containerized with **Docker**, deployed on **Kubernetes**, and backed by a complete DevOps pipeline combining **Jenkins**, **GitHub Actions**, **GitLab CI**, **Ansible**, **ArgoCD**, and **SonarQube**.

---

## 🏗 Architecture

```
                        ┌─────────────────────────────────┐
                        │       E-Learning Platform        │
                        │                                  │
  Browser  ──HTTP──►   │  ┌───────────┐   ┌───────────┐  │
                        │  │   React   │──►│  Node.js  │  │
                        │  │ Frontend  │   │   API     │  │
                        │  │  :3000    │   │  :5000    │  │
                        │  └───────────┘   └─────┬─────┘  │
                        │                        │         │
                        │                  ┌─────▼─────┐  │
                        │                  │  MongoDB  │  │
                        │                  │  :27017   │  │
                        │                  └───────────┘  │
                        └─────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Application

| Layer      | Technology              | Role                          |
|------------|-------------------------|-------------------------------|
| Frontend   | React.js                | SPA — UI & user experience    |
| Backend    | Node.js + Express       | REST API & business logic     |
| Database   | MongoDB                 | Data persistence              |

### DevOps & Infrastructure

| Tool              | Role                                      |
|-------------------|-------------------------------------------|
| 🐳 Docker          | Containerization of frontend & backend   |
| 🐙 Docker Compose  | Local multi-container orchestration      |
| ☸️ Kubernetes       | Production container orchestration       |
| 🔧 Ansible         | Server provisioning & configuration      |
| 🔄 ArgoCD          | GitOps continuous delivery               |
| 🏗 Jenkins         | CI/CD pipeline automation                |
| ⚡ GitHub Actions  | Cloud-native CI workflows                |
| 🦊 GitLab CI       | Alternative CI pipeline                  |
| 🔍 SonarQube       | Static code analysis & quality gate      |

---

## 📁 Project Structure

```
e-learning/
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions — lint, test, build, push
│
├── E-LearningFrontend/             # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
│
├── E-LearningBackend/              # Node.js / Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── Dockerfile
│   └── package.json
│
├── kubernetes/                     # Kubernetes manifests
│   ├── deploy-frontend.yaml
│   ├── deploy-backend.yaml
│   ├── service-frontend.yaml
│   ├── service-backend.yaml
│   └── ingress.yaml
│
├── ansible/                        # Ansible playbooks & inventory
│   ├── inventory/
│   │   └── hosts.ini
│   └── playbooks/
│       └── setup.yml
│
├── .gitlab-ci.yml                  # GitLab CI pipeline
├── Jenkinsfile                     # Jenkins declarative pipeline
├── docker-compose.yml              # Local dev stack
├── sonar-project.properties        # SonarQube config
├── master.pem.pub                  # SSH key — master node
├── worker.pem.pub                  # SSH key — worker node
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Tool             | Version   | Install |
|------------------|-----------|---------|
| Docker           | ≥ 20.x    | [docs.docker.com](https://docs.docker.com/get-docker/) |
| Docker Compose   | ≥ 2.x     | [docs.docker.com](https://docs.docker.com/compose/install/) |
| Node.js          | ≥ 18.x    | [nodejs.org](https://nodejs.org/) |
| kubectl          | latest    | [kubernetes.io](https://kubernetes.io/docs/tasks/tools/) |
| Ansible          | ≥ 2.14    | [docs.ansible.com](https://docs.ansible.com/) |

---

### Local Development — Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/anasmnasri2023/e-learning.git
cd e-learning

# 2. Start the full stack (frontend + backend + MongoDB)
docker-compose up --build

# 3. Access the services
#    Frontend  →  http://localhost:3000
#    Backend   →  http://localhost:5000
#    MongoDB   →  mongodb://localhost:27017
```

Stop all services:

```bash
docker-compose down
```

---

### Local Development — Without Docker

```bash
# Backend
cd E-LearningBackend
npm install
npm run dev        # starts on http://localhost:5000

# Frontend (new terminal)
cd E-LearningFrontend
npm install
npm start          # starts on http://localhost:3000
```

---

### Environment Variables

Create a `.env` file in `E-LearningBackend/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/elearning
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

Create a `.env` file in `E-LearningFrontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🔄 CI/CD Pipeline

The project implements a multi-stage pipeline across three CI platforms.

### 🐙 GitHub Actions — `.github/workflows/ci.yml`

```
Git Push / Pull Request
        │
        ├─► 📦 Install dependencies (npm ci)
        ├─► 🧪 Run unit & integration tests
        ├─► 🔍 SonarQube code analysis
        ├─► 🐳 Build Docker images
        └─► 📤 Push images to Docker Hub / Registry
```

### 🏗 Jenkins — `Jenkinsfile`

```groovy
pipeline {
  stages {
    stage('Checkout')       // Pull source code
    stage('Install')        // npm ci (backend + frontend)
    stage('Test')           // npm test
    stage('SonarQube')      // Quality gate check
    stage('Docker Build')   // Build & tag images
    stage('Docker Push')    // Push to registry
    stage('Deploy K8s')     // kubectl apply
  }
}
```

### 🦊 GitLab CI — `.gitlab-ci.yml`

```yaml
stages:
  - test       # lint + unit tests
  - build      # docker build & push
  - deploy     # kubectl apply to cluster
```

---

## 🏛 Infrastructure

### ☸️ Kubernetes

```bash
# Create namespace
kubectl create namespace e-learning

# Deploy backend
kubectl apply -f kubernetes/deploy-backend.yaml
kubectl apply -f kubernetes/service-backend.yaml

# Deploy frontend
kubectl apply -f kubernetes/deploy-frontend.yaml
kubectl apply -f kubernetes/service-frontend.yaml

# Apply ingress
kubectl apply -f kubernetes/ingress.yaml

# Monitor pods
kubectl get pods -n e-learning
kubectl logs -f deployment/backend -n e-learning
```

---

### 🔧 Ansible

Ansible provisions the Kubernetes master and worker nodes.

```bash
# Test connectivity
ansible all -i ansible/inventory/hosts.ini -m ping --private-key master.pem

# Provision all nodes (install Docker, kubeadm, kubelet, kubectl)
ansible-playbook -i ansible/inventory/hosts.ini \
  ansible/playbooks/setup.yml \
  --private-key master.pem

# Target only workers
ansible-playbook -i ansible/inventory/hosts.ini \
  ansible/playbooks/setup.yml \
  --private-key worker.pem \
  --limit workers
```

> SSH public keys are committed as `master.pem.pub` and `worker.pem.pub`.  
> Keep the private keys (`.pem`) **out of version control** — add them to `.gitignore`.

---

### 🔄 ArgoCD — GitOps

ArgoCD watches the `kubernetes/` directory and automatically syncs the cluster state with every new commit.

```bash
# Install ArgoCD in the cluster
kubectl create namespace argocd
kubectl apply -n argocd \
  -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access the UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
# → https://localhost:8080

# Get the initial admin password
kubectl get secret argocd-initial-admin-secret -n argocd \
  -o jsonpath="{.data.password}" | base64 -d

# Register the application
argocd app create e-learning \
  --repo https://github.com/anasmnasri2023/e-learning.git \
  --path kubernetes \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace e-learning \
  --sync-policy automated

# Sync manually if needed
argocd app sync e-learning

# Watch live status
argocd app get e-learning
```

---

## 🔍 Code Quality

Static analysis is handled by **SonarQube**, configured via `sonar-project.properties`.

```bash
# Run analysis locally (requires sonar-scanner CLI)
sonar-scanner \
  -Dsonar.projectKey=e-learning \
  -Dsonar.sources=E-LearningBackend/src,E-LearningFrontend/src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=<your-token>
```

Quality gates are enforced in the CI pipeline — a failed gate **blocks** the deployment stage.

Metrics tracked: code coverage · code smells · bugs · vulnerabilities · duplications

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit using conventional commits: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

> Ensure all tests pass and the SonarQube quality gate is green before submitting.

---

<div align="center">

Made with ❤️ by [@anasmnasri2023](https://github.com/anasmnasri2023)

</div>
