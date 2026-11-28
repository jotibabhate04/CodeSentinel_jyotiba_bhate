<div align="center">

# CodeSentinel – Automated DevSecOps Platform

**End-to-End Automated CI/CD, Static & Container Security Scanning, Configuration Management, and 3-Tier Cloud Deployment on AWS EC2**

[![Jenkins CI/CD](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins&logoColor=white)](./Jenkinsfile)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](./docker-compose.yml)
[![SonarQube](https://img.shields.io/badge/SonarQube-Code_Quality-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white)](./sonar-project.properties)
[![Trivy](https://img.shields.io/badge/Trivy-Security_Scan-1904DA?style=for-the-badge&logo=aquasecurity&logoColor=white)](./Jenkinsfile)
[![Ansible](https://img.shields.io/badge/Ansible-Automation-EE0000?style=for-the-badge&logo=ansible&logoColor=white)](./ansible/playbooks/deploy.yml)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](./infra/terraform/main.tf)
[![AWS EC2](https://img.shields.io/badge/AWS-EC2_%26_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](./infra/terraform/main.tf)
[![NGINX](https://img.shields.io/badge/NGINX-Reverse_Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white)](./frontend/nginx.conf)

[Architecture](#6-complete-system-architecture) • [CI/CD Pipeline](#7-automated-devsecops-cicd-pipeline) • [Tech Stack](#5-technology-stack) • [Setup Guide](#20-installation-and-setup) • [Screenshots](#18-project-screenshots-gallery)

</div>

---

## 1. Project Title and Professional Introduction

**CodeSentinel** is a production-oriented **Automated DevSecOps Platform** built around a containerized three-tier Task Management web application. Every code push to the GitHub `main` branch triggers an automated **Jenkins** pipeline via a GitHub webhook that executes deterministic dependency installation, automated backend and frontend testing with LCOV coverage, **SonarQube** static code analysis, multi-stage **Docker** builds, **Trivy** container vulnerability gates (`CRITICAL` and `HIGH` severity enforcement), **Ansible** deployment, and automated HTTP health verification on an **AWS EC2 Ubuntu** server.

---

## 2. Project Overview

Modern software delivery requires security, quality, and repeatability to be enforced automatically rather than manually. CodeSentinel demonstrates a complete DevSecOps lifecycle by integrating:

- **Three-Tier Web Application:** A React 18 + Vite + Tailwind CSS single-page application served through an **NGINX** reverse proxy, communicating with a **Node.js 20 / Express** REST API backed by **MySQL 8.0**.
- **Automated Quality & Security Gates:** 23 backend integration tests (with `c8` coverage), Vitest frontend unit tests (with `@vitest/coverage-v8`), **SonarQube** static analysis, and **Trivy** image scanning that blocks deployment if `CRITICAL` or `HIGH` CVEs are detected.
- **Automated Deployment & IaC:** **Ansible** orchestrates Docker Compose rollouts with dynamic AWS EC2 IMDSv2 public IP resolution for CORS, while **Terraform** defines and validates an encrypted, versioned AWS S3 artifacts bucket alongside the existing EC2 instance data source.

---

## 3. Project Objectives

- Automate build, test, security scanning, and deployment from a single `git push` to `main`.
- Enforce shift-left code quality using **SonarQube** with combined backend and frontend LCOV test coverage.
- Enforce container security using **Trivy** (`--exit-code 1 --severity CRITICAL,HIGH`) before any container is deployed.
- Containerize all application tiers using lightweight Alpine base images, non-root execution, and isolated bridge networking.
- Eliminate manual server deployment steps using **Ansible** playbooks and automated health checks.
- Provision and validate cloud storage infrastructure declaratively using **Terraform**.

---

## 4. Key Features

- **Webhook-Driven CI/CD:** Instant pipeline execution via `githubPush()` trigger in [`Jenkinsfile`](./Jenkinsfile) with concurrent build protection and 45-minute timeout.
- **Isolated Coverage Testing:** Backend integration tests (`23` E2E API assertions in [`backend/test_api.js`](./backend/test_api.js)) run against an isolated `codesentinel_coverage` MySQL database.
- **Dual-Layer Security Enforcement:**
  - Application security: `helmet`, `cors` allowlisting, `bcryptjs` password hashing, `jsonwebtoken` auth, and `express-validator` input validation.
  - Pipeline security: SonarQube SAST + Trivy container vulnerability gates for both `codesentinel-backend:latest` and `codesentinel-frontend:latest`.
- **Dynamic EC2 CORS Configuration:** Jenkins queries AWS EC2 IMDSv2 (`169.254.169.254`) at deploy time to inject the instance's public IPv4 address into `ALLOWED_ORIGINS`.
- **Zero-Exposure Database Tier:** MySQL 8.0 is bound strictly to the internal `codesentinel-network` Docker bridge with persistent volume storage (`codesentinel_mysql_data`).
- **Automated Post-Deploy Verification:** Both Ansible (`uri` module) and Jenkins (`curl`) verify HTTP `200` responses on `/` and `/api/health`.

---

## 5. Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=flat-square&logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=flat-square&logo=react-router&logoColor=white) ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) ![Helmet](https://img.shields.io/badge/Helmet-Security-4B5563?style=flat-square) |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL_8.0-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **Testing & Coverage** | ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white) ![Testing Library](https://img.shields.io/badge/Testing_Library-E33332?style=flat-square&logo=testinglibrary&logoColor=white) ![c8](https://img.shields.io/badge/c8-LCOV_Coverage-0F172A?style=flat-square) |
| **CI/CD & Automation** | ![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=flat-square&logo=jenkins&logoColor=white) ![Ansible](https://img.shields.io/badge/Ansible-EE0000?style=flat-square&logo=ansible&logoColor=white) ![GitHub Webhooks](https://img.shields.io/badge/GitHub_Webhooks-181717?style=flat-square&logo=github&logoColor=white) |
| **Security & Quality** | ![SonarQube](https://img.shields.io/badge/SonarQube-4E9BCD?style=flat-square&logo=sonarqube&logoColor=white) ![Trivy](https://img.shields.io/badge/Trivy-1904DA?style=flat-square&logo=aquasecurity&logoColor=white) |
| **Containers & Proxy** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Docker Compose](https://img.shields.io/badge/Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white) ![NGINX](https://img.shields.io/badge/NGINX-009639?style=flat-square&logo=nginx&logoColor=white) |
| **Cloud & IaC** | ![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazonaws&logoColor=white) ![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=flat-square&logo=amazons3&logoColor=white) ![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=flat-square&logo=terraform&logoColor=white) ![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=ubuntu&logoColor=white) |

---

## 6. Complete System Architecture

The diagram below illustrates the full end-to-end automated DevSecOps architecture implemented in this repository—covering source control, webhook triggers, Jenkins CI/CD stages, SonarQube and Trivy gates, Docker Compose containerization, Ansible deployment, AWS EC2 runtime, and standalone Terraform IaC.

![CodeSentinel Automated DevSecOps Architecture](./docs/architecture/codesentinel-architecture.svg)

### Interactive Architecture Flow (Mermaid)

```mermaid
flowchart LR
    DEV[Developer<br/>git push main] --> GH[GitHub Repository<br/>jotibabhate04/CodeSentinel_jyotiba_bhate]
    GH -->|githubPush Webhook| J[Jenkins CI/CD Server]

    subgraph CI[CI, Testing & Static Analysis]
        J --> S1[1. Git Checkout]
        S1 --> S2[2-3. npm ci<br/>Backend & Frontend]
        S2 --> S3[4. Backend c8 + 23 API Tests<br/>codesentinel_coverage DB]
        S3 --> S4[5. Frontend Vitest Coverage]
        S4 --> S5[6. SonarQube Analysis<br/>LCOV Ingestion]
    end

    subgraph SEC[Build & Container Security Gates]
        S5 --> S6[7. Vite Production Build]
        S6 --> S7[8. Docker Compose Build<br/>--no-cache]
        S7 --> S8[9a. Trivy Backend Scan<br/>CRITICAL,HIGH -> exit 1]
        S8 --> S9[9b. Trivy Frontend Scan<br/>CRITICAL,HIGH -> exit 1]
    end

    subgraph CD[Automated Deployment on AWS EC2]
        S9 --> S10[10. Ansible Playbook<br/>deploy.yml + EC2 IMDSv2 IP]
        S10 --> DC[Docker Compose Up<br/>codesentinel-network]
        DC --> S11[11. Health Verification<br/>HTTP 200 / & /api/health]
    end

    subgraph EC2[AWS EC2 Ubuntu - 3-Tier Runtime]
        USR[End Users :80] --> NGX[NGINX Reverse Proxy<br/>codesentinel-frontend :80]
        NGX -->|Static SPA| SPA[React 18 + Vite]
        NGX -->|/api/ proxy_pass| API[Node.js 20 + Express<br/>codesentinel-backend :5000]
        API -->|mysql2 pool :3306| DB[(MySQL 8.0<br/>codesentinel-mysql)]
        DB --- VOL[(codesentinel_mysql_data)]
    end

    S11 -.-> EC2
    TF[Terraform IaC<br/>infra/terraform/main.tf] -.->|Provisioned Separately| S3[(AWS S3 Artifacts Bucket<br/>AES256 + Versioned)]
```

---

## 7. Automated DevSecOps CI/CD Pipeline

Every push to `main` runs through **11 declarative Jenkins stages** defined in [`Jenkinsfile`](./Jenkinsfile), with strict failure gates and post-build cleanup.

![CodeSentinel Automated CI/CD Pipeline](./docs/architecture/codesentinel-cicd-pipeline.svg)

| Stage # | Jenkins Stage | Key Commands / Actions | Gate / Output |
| :--- | :--- | :--- | :--- |
| **01** | `Git Checkout` | `checkout scm`, `git rev-parse --short HEAD` | Exact commit SHA |
| **02** | `Backend Dependency Installation` | `dir('backend') { npm ci }` | Clean lockfile install |
| **03** | `Frontend Dependency Installation` | `dir('frontend') { npm ci }` | Clean lockfile install |
| **04** | `Backend Tests & Coverage` | `c8` + `node src/server.js` (port `5001`) + `node test_api.js` | 23 API tests + `backend/coverage/lcov.info` |
| **05** | `Frontend Tests & Coverage` | `npm run coverage` (Vitest + v8) | Unit tests + `frontend/coverage/lcov.info` |
| **06** | `SonarQube Analysis` | `sonar-scanner -Dsonar.projectBaseDir="$WORKSPACE"` | Static analysis + LCOV reports |
| **07** | `Frontend Build` | `VITE_API_BASE_URL=/api npm run build` | Production Vite bundle |
| **08** | `Docker Image Build` | `docker compose build --no-cache` | Fresh Alpine container images |
| **09** | `Trivy Security Scan` | `trivy image --scanners vuln --exit-code 1 --severity CRITICAL,HIGH` | Blocks deploy on HIGH/CRITICAL CVEs |
| **10** | `Ansible Deployment` | EC2 IMDSv2 IP lookup + `ansible-playbook deploy.yml` | `docker compose up -d --remove-orphans` |
| **11** | `Application Health Verification` | `docker compose ps`, `curl -fsS http://localhost/`, `/api/health` | Confirms HTTP 200 & `status: UP` |

---

## 8. Architecture Workflow Explanation

1. **Trigger:** A developer pushes code to GitHub (`main`), firing a webhook (`githubPush()`) to Jenkins.
2. **Build & Test:** Jenkins checks out the repository, installs locked npm dependencies (`npm ci`), creates an isolated `codesentinel_coverage` MySQL database, runs 23 backend E2E integration tests under `c8`, and runs frontend Vitest tests.
3. **Code Quality:** Jenkins verifies both `lcov.info` reports exist and invokes `sonar-scanner` using [`sonar-project.properties`](./sonar-project.properties).
4. **Containerization & Security:** Docker Compose builds fresh `codesentinel-backend:latest` and `codesentinel-frontend:latest` images with `--no-cache`. **Trivy** scans both images and aborts the pipeline if any `CRITICAL` or `HIGH` vulnerabilities are found.
5. **Deployment & Verification:** Jenkins queries the AWS EC2 metadata service (IMDSv2) for the server's public IPv4 address to configure `ALLOWED_ORIGINS`, then executes Ansible [`deploy.yml`](./ansible/playbooks/deploy.yml) to start the stack and verify HTTP `200` responses from both NGINX and the Express API.

---

## 9. Docker Containerization

All three application tiers are orchestrated via [`docker-compose.yml`](./docker-compose.yml) on a dedicated bridge network (`codesentinel-network`):

- **Backend ([`backend/Dockerfile`](./backend/Dockerfile)):**
  - Base image: `node:20-alpine` with `apk update && apk upgrade --no-cache`.
  - Installs production dependencies only (`npm ci --omit=dev`).
  - Runs as non-root `USER node` on internal port `5000`.
  - Built-in Docker `HEALTHCHECK` polling `http://127.0.0.1:5000/api/health`.
- **Frontend ([`frontend/Dockerfile`](./frontend/Dockerfile)):**
  - Multi-stage build: Stage 1 (`node:20-alpine`) compiles the React/Vite bundle with `VITE_API_BASE_URL=/api`; Stage 2 (`nginx:stable-alpine`) upgrades Alpine packages and serves static assets on port `80`.
  - Built-in Docker `HEALTHCHECK` polling `http://127.0.0.1:80/`.
- **Database (`mysql:8.0`):**
  - Mounts [`database/init.sql`](./database/init.sql) to `/docker-entrypoint-initdb.d/init.sql:ro`.
  - Uses named persistent volume `codesentinel_mysql_data` and `mysqladmin ping` healthcheck.

---

## 10. Jenkins CI/CD Automation

The declarative pipeline in [`Jenkinsfile`](./Jenkinsfile) enforces reliability and security best practices:

- **Pipeline Options:** `timeout(45m)`, `buildDiscarder(numToKeepStr: '10')`, `disableConcurrentBuilds()`, and `timestamps()`.
- **Credential Binding:** Sensitive runtime values (`DB_ROOT_PASSWORD`, `DB_PASSWORD`, `JWT_SECRET`) are injected securely from Jenkins Credentials (`codesentinel-db-root-password`, `codesentinel-db-password`, `codesentinel-jwt-secret`).
- **Post-Build Hooks:**
  - `success`: Confirms live deployment.
  - `failure`: Dumps `docker compose logs --tail=50` for rapid root-cause analysis.
  - `always`: Runs `docker image prune -f` to prevent disk exhaustion on the EC2 host.

---

## 11. SonarQube Code Quality Analysis

Static code analysis is configured in [`sonar-project.properties`](./sonar-project.properties):

```properties
sonar.projectKey=CodeSentinel
sonar.projectName=CodeSentinel
sonar.projectVersion=1.0
sonar.sources=backend/src,frontend/src
sonar.sourceEncoding=UTF-8
sonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,**/coverage/**
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info
```

Jenkins runs `withSonarQubeEnv('SonarQube')` with the `SonarScanner` tool after verifying that both `backend/coverage/lcov.info` and `frontend/coverage/lcov.info` are non-empty.

---

## 12. Trivy Vulnerability Scanning

Container image scanning is enforced as a mandatory blocking stage in [`Jenkinsfile`](./Jenkinsfile) before Ansible deployment:

```bash
trivy image --scanners vuln --exit-code 1 --severity CRITICAL,HIGH codesentinel-backend:latest
trivy image --scanners vuln --exit-code 1 --severity CRITICAL,HIGH codesentinel-frontend:latest
```

Both `node:20-alpine` and `nginx:stable-alpine` Dockerfiles run `apk upgrade --no-cache` during build so OS-level packages are patched prior to Trivy inspection.

---

## 13. Ansible Automated Deployment

Deployment is automated via Ansible using local connection on the EC2 host:

- [`ansible/ansible.cfg`](./ansible/ansible.cfg): Points to `./inventory/hosts.ini`, disables host key checking and retry files, and configures `sudo` privilege escalation defaults.
- [`ansible/inventory/hosts.ini`](./ansible/inventory/hosts.ini): Defines `[app_servers]` with `localhost ansible_connection=local`.
- [`ansible/playbooks/deploy.yml`](./ansible/playbooks/deploy.yml):
  1. Verifies `docker-compose.yml` exists.
  2. Injects environment variables (`COMPOSE_PROJECT_NAME`, `DB_NAME`, `DB_USER`, `DB_ROOT_PASSWORD`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `ALLOWED_ORIGINS`).
  3. Executes `docker compose up -d --remove-orphans`.
  4. Polls `http://127.0.0.1/` and `http://127.0.0.1/api/health` (10 retries, 5s delay) until both return HTTP `200`.

---

## 14. AWS EC2 Infrastructure

The production workload runs on an **AWS EC2 Ubuntu Server** (referenced in Terraform via `data "aws_instance" "codesentinel"` with default instance ID `i-0736a394f3cb2b214` in `us-east-1`).

- **Inbound Traffic:** HTTP port `80` is exposed through the AWS EC2 Security Group to the `codesentinel-frontend` NGINX container.
- **Internal Isolation:** Backend port `5000` and MySQL port `3306` use Docker `expose` (never `ports`), keeping them unreachable from the public internet.
- **Metadata Integration:** The Jenkins deployment stage queries IMDSv2 (`http://169.254.169.254/latest/api/token`) to dynamically retrieve the EC2 public IPv4 and whitelist it in `ALLOWED_ORIGINS`.

---

## 15. NGINX Reverse Proxy

[`frontend/nginx.conf`](./frontend/nginx.conf) serves as both the static asset server and the API reverse proxy on port `80`:

- **SPA Routing:** `try_files $uri $uri/ /index.html;` ensures React Router routes resolve cleanly on refresh.
- **API Proxying:** Requests to `/api/` are forwarded to `http://backend:5000/api/` with `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`, and 60s timeouts.
- **Performance:** Gzip compression enabled for HTML, CSS, JS, XML, and JSON; static assets cached for 6 months (`max-age=15552000, immutable`).
- **Security Headers:** Sets `X-Frame-Options: SAMEORIGIN`, `X-XSS-Protection: 1; mode=block`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 16. Frontend, Backend and MySQL Architecture

- **Frontend (`frontend/src/`):** React 18 SPA with `AuthContext`, `ThemeContext`, `ToastContext`, protected/public route guards, and modular task management components (`TaskCard`, `TaskTable`, `TaskFilters`, `TaskModal`, `StatCard`, `Sidebar`, `Navbar`).
- **Backend (`backend/src/`):** Express REST API with MVC + validator layering:
  - `GET /api/health` — Service health probe (`status: "UP"`).
  - `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile` — JWT authentication with `bcryptjs`.
  - `GET /api/tasks`, `POST /api/tasks`, `GET /api/tasks/stats`, `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `PATCH /api/tasks/:id/status`, `DELETE /api/tasks/:id` — Protected CRUD + analytics endpoints.
- **Database (`database/init.sql` & `backend/src/config/db.js`):** MySQL 8.0 `codesentinel_db` (`utf8mb4_unicode_ci`) with indexed `users` and `tasks` tables linked via `fk_tasks_user` (`ON DELETE CASCADE`, `ON UPDATE CASCADE`).

---

## 17. Terraform Configuration and Validation

Infrastructure as Code is defined in [`infra/terraform/main.tf`](./infra/terraform/main.tf) (`terraform >= 1.5.0`, `hashicorp/aws >= 5.0`) and validated independently of the Jenkins pipeline:

- **Data Sources:** Reads `aws_caller_identity.current` and `aws_instance.codesentinel` (`us-east-1`).
- **S3 Artifacts Bucket:** Provisions `codesentinel-artifacts-<account_id>-us-east-1` with:
  - Versioning enabled (`aws_s3_bucket_versioning`).
  - AES256 server-side encryption (`aws_s3_bucket_server_side_encryption_configuration`).
  - Full public access block (`block_public_acls`, `block_public_policy`, `ignore_public_acls`, `restrict_public_buckets`).
  - Lifecycle rules (`cleanup-old-artifacts`: 90-day object expiration, 7-day incomplete multipart abort, 30-day noncurrent version expiration).

```bash
cd infra/terraform
terraform init
terraform validate
terraform plan
```

---

## 18. Project Screenshots Gallery

All screenshots below are captured directly from the live **CodeSentinel** AWS EC2 deployment, Jenkins CI/CD pipeline, SonarQube server, Trivy security scans, and Terraform validation.

### AWS EC2, Security Group & Terraform Validation

| AWS EC2 Instance Summary | AWS EC2 Security Group |
| :---: | :---: |
| ![AWS EC2 Instance Summary](./docs/screenshots/aws-ec2-instance-summary.png) | ![AWS EC2 Security Group](./docs/screenshots/aws-ec2-security-group.png) |
| *EC2 instance `i-0736a394f3cb2b214` (`m7i-flex.large`, `us-east-1d`) passing 3/3 status checks* | *Security Group inbound rules for HTTP (80), Jenkins (8080), SonarQube (9000), and SSH (22)* |

| AWS EC2 IAM Role | Terraform Configuration Validation |
| :---: | :---: |
| ![AWS EC2 IAM Role](./docs/screenshots/aws-ec2-iam-role.png) | ![Terraform Validation](./docs/screenshots/terraform-validation.png) |
| *`CodeSentinel-EC2-Terraform-Role` attached to the EC2 instance* | *`terraform fmt -check` and `terraform validate` passing on `infra/terraform/main.tf`* |

### Application Registration, Login & Dashboard

| Operator Registration | Operator Sign In |
| :---: | :---: |
| ![CodeSentinel Registration](./docs/screenshots/app-register.png) | ![CodeSentinel Login](./docs/screenshots/app-login.png) |
| *Account creation with input validation and isolated tenancy* | *JWT-authenticated login backed by bcryptjs and MySQL 8.0* |

| Operations Dashboard | Create New Task Modal |
| :---: | :---: |
| ![CodeSentinel Dashboard](./docs/screenshots/app-dashboard.png) | ![CodeSentinel Create Task](./docs/screenshots/app-create-task-modal.png) |
| *Task summary metrics, search, priority filtering, and theme toggle* | *Task creation modal with priority, status, and due date fields* |

### GitHub Webhook & Jenkins CI/CD Pipeline

| GitHub Webhook Configuration | GitHub Webhook Delivery (HTTP 200) |
| :---: | :---: |
| ![GitHub Webhook Configuration](./docs/screenshots/github-webhook-config.png) | ![GitHub Webhook Delivery](./docs/screenshots/github-webhook-delivery.png) |
| *Active push webhook pointing to Jenkins `/github-webhook/`* | *Successful `200` webhook delivery payload on push to `main`* |

| Jenkins Pipeline Stages | Jenkins Stage View (Build #24) |
| :---: | :---: |
| ![Jenkins Pipeline Stages](./docs/screenshots/jenkins-pipeline-stages.png) | ![Jenkins Stage View](./docs/screenshots/jenkins-stage-view.png) |
| *Multi-run stage graph showing automated build history* | *All 11 declarative stages completing cleanly in ~1m 26s* |

### SonarQube Code Quality & Trivy Vulnerability Scans

| SonarQube Project Overview | SonarQube Issues View |
| :---: | :---: |
| ![SonarQube Project Overview](./docs/screenshots/sonarqube-project-overview.png) | ![SonarQube Issues](./docs/screenshots/sonarqube-issues.png) |
| *3.9k LOC analyzed with Grade A Security, Reliability & Maintainability and 48.8% LCOV coverage* | *Zero open issues across `backend/src` and `frontend/src`* |

| SonarQube Activity Timeline | SonarQube Quality Gate History |
| :---: | :---: |
| ![SonarQube Activity](./docs/screenshots/sonarqube-activity.png) | ![SonarQube Quality Gate History](./docs/screenshots/sonarqube-quality-gate-history.png) |
| *Issue trend dropping to zero across pipeline runs* | *Quality Gate history tracking across `main` branch releases* |

| Trivy Backend Scan (Jenkins #24) | Trivy Frontend Scan (Jenkins #24) |
| :---: | :---: |
| ![Trivy Backend Scan Jenkins](./docs/screenshots/jenkins-trivy-backend-scan.png) | ![Trivy Frontend Scan Jenkins](./docs/screenshots/jenkins-trivy-frontend-scan.png) |
| *`codesentinel-backend:latest` (`alpine 3.23.4`) — 0 CRITICAL/HIGH vulnerabilities* | *`codesentinel-frontend:latest` (`alpine 3.24.4`) — 0 CRITICAL/HIGH vulnerabilities* |

| Trivy CLI Backend Scan | Trivy CLI Frontend Scan |
| :---: | :---: |
| ![Trivy CLI Backend Scan](./docs/screenshots/trivy-cli-backend-scan.png) | ![Trivy CLI Frontend Scan](./docs/screenshots/trivy-cli-frontend-scan.png) |
| *Direct EC2 CLI verification of backend image with Trivy v0.76.2* | *Direct EC2 CLI verification of frontend image with 0 vulnerabilities* |

### Ansible Deployment, Docker Compose & Health Verification

| Jenkins Ansible Deployment Stage | Ansible Inventory & Syntax Check |
| :---: | :---: |
| ![Jenkins Ansible Deployment](./docs/screenshots/jenkins-ansible-deployment.png) | ![Ansible Inventory and Syntax](./docs/screenshots/ansible-inventory-syntax.png) |
| *IMDSv2 public IP injection into `ALLOWED_ORIGINS` and `deploy.yml` execution* | *`ansible-inventory --list` and `ansible-playbook --syntax-check` verification* |

| Docker Compose Services | Application Health Verification |
| :---: | :---: |
| ![Docker Compose Services](./docs/screenshots/docker-compose-services.png) | ![Application Health Check](./docs/screenshots/app-health-check.png) |
| *All three containers (`backend`, `frontend`, `mysql`) reporting `Up (healthy)`* | *Frontend HTTP `200`, `/api/health` returning `{"status":"UP"}`, and `Finished: SUCCESS`* |

---

## 19. Project Directory Structure

```text
CodeSentinel_jyotiba_bhate/
├── .env.example
├── .gitignore
├── Jenkinsfile
├── README.md
├── sonar-project.properties
├── docker-compose.yml
├── ansible/
│   ├── ansible.cfg
│   ├── inventory/
│   │   └── hosts.ini
│   └── playbooks/
│       └── deploy.yml
├── backend/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   ├── test_api.js
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/db.js
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── validators/
├── database/
│   └── init.sql
├── docs/
│   ├── architecture/
│   │   ├── codesentinel-architecture.svg
│   │   └── codesentinel-cicd-pipeline.svg
│   └── screenshots/
├── frontend/
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   ├── package-lock.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── api/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── test/
└── infra/
    └── terraform/
        ├── .terraform.lock.hcl
        └── main.tf
```

---

## 20. Installation and Setup

### Prerequisites
- Docker & Docker Compose v2
- Node.js 20+ (for local development/testing)
- Jenkins with SonarQube Scanner, Trivy, and Ansible installed on the CI/CD server (for pipeline execution)
- Terraform >= 1.5.0 & AWS CLI (for IaC validation)

### Clone the Repository

```bash
git clone https://github.com/jotibabhate04/CodeSentinel_jyotiba_bhate.git
cd CodeSentinel_jyotiba_bhate
```

---

## 21. Environment Variables Configuration

Copy the root environment template and populate strong credentials before running Docker Compose locally:

```bash
cp .env.example .env
```

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DB_NAME` | MySQL database name | `codesentinel_db` |
| `DB_USER` | Application MySQL user | `codesentinel_user` |
| `DB_PASSWORD` | Application MySQL password | *Strong password (required)* |
| `DB_ROOT_PASSWORD` | MySQL root password | *Strong password (required)* |
| `JWT_SECRET` | High-entropy JWT signing key (min 32 chars) | *Secret key (required)* |
| `JWT_EXPIRES_IN` | JWT token expiration | `24h` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost,http://localhost:80` |

> Never commit `.env` files or real credentials to GitHub. In Jenkins, `DB_ROOT_PASSWORD`, `DB_PASSWORD`, and `JWT_SECRET` are managed via Jenkins Credentials.

---

## 22. Run Project Using Docker Compose

Build and start all three services (`mysql`, `backend`, `frontend`):

```bash
docker compose up -d --build
```

Verify running containers and health status:

```bash
docker compose ps
```

Access the application:
- **Web Application (NGINX):** `http://localhost/`
- **Backend Health Endpoint:** `http://localhost/api/health`

To stop and remove containers (preserving the `codesentinel_mysql_data` volume):

```bash
docker compose down
```

---

## 23. Jenkins Pipeline Execution

1. Configure Jenkins Credentials:
   - `codesentinel-db-root-password`
   - `codesentinel-db-password`
   - `codesentinel-jwt-secret`
2. Configure Jenkins Global Tools & System:
   - SonarQube server named `SonarQube`
   - SonarScanner tool named `SonarScanner`
3. Create a Jenkins Pipeline job pointing to `https://github.com/jotibabhate04/CodeSentinel_jyotiba_bhate.git` (`main` branch, script path `Jenkinsfile`).
4. Enable **GitHub hook trigger for GITScm polling** and configure a GitHub Webhook pointing to `http://<JENKINS_URL>/github-webhook/`.
5. Push to `main` or trigger **Build Now** to run all 11 stages.

---

## 24. Deployment and Health Checks

After Ansible completes `docker compose up -d --remove-orphans`, both Ansible and Jenkins validate service readiness:

```bash
# Check container states and Docker healthchecks
docker compose ps

# Verify NGINX serves the React SPA (HTTP 200)
curl -fsS -o /dev/null -w "Frontend HTTP Status: %{http_code}\n" http://localhost/

# Verify Express API health through NGINX reverse proxy
curl -fsS http://localhost/api/health
```

Expected `/api/health` response:

```json
{
  "status": "UP",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "service": "CodeSentinel API",
  "version": "1.0.0"
}
```

---

## 25. Security Best Practices

- **Least-Privilege Containers:** Backend runs as non-root `USER node`; MySQL and Backend ports are never published to the host network.
- **Image Hardening:** Both Dockerfiles run `apk upgrade --no-cache` and Trivy blocks any build with `HIGH` or `CRITICAL` vulnerabilities.
- **API & HTTP Hardening:** `helmet()` middleware, strict `ALLOWED_ORIGINS` CORS validation, `express-validator` schemas, `bcryptjs` password hashing, and NGINX security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- **Cloud Storage Security:** Terraform enforces AES256 encryption, versioning, and all four S3 public access block flags.
- **Secret Hygiene:** `.env` is excluded via `.gitignore`; CI/CD secrets are stored exclusively in Jenkins Credentials.

---

## 26. Challenges and Solutions

- **Isolated Test Database During CI:** Running 23 integration tests against the production database risked polluting live data. **Solution:** Jenkins dynamically inspects the `codesentinel-mysql` container IP, provisions an isolated `codesentinel_coverage` database, and runs `c8` on port `5001` before tearing down the process cleanly via `trap cleanup EXIT`.
- **Dynamic EC2 Public IP for CORS:** Hardcoding EC2 IPs breaks after instance restarts. **Solution:** The `Ansible Deployment` stage queries AWS EC2 IMDSv2 (`169.254.169.254`) at runtime to populate `ALLOWED_ORIGINS` automatically.
- **Combined Coverage Reporting:** SonarQube required unified coverage across two separate Node projects. **Solution:** Both `c8` (backend) and `vitest --coverage` (frontend) output `lcov.info` files referenced together in `sonar-project.properties`.

---

## 27. Future Enhancements

- Add HTTPS/TLS termination with Let's Encrypt (Certbot) or AWS Application Load Balancer + ACM.
- Push versioned Docker images to Amazon ECR or Docker Hub with immutable SHA tags.
- Add automated rollback in Ansible if post-deployment health checks fail.
- Integrate Slack or email notifications in Jenkins `post` blocks for build status alerts.

---

## 28. Project Author and GitHub Profile

**Jyotiba Bhate**  
DevOps & Cloud Engineer

- **GitHub Profile:** [@jotibabhate04](https://github.com/jotibabhate04)
- **Project Repository:** [CodeSentinel_jyotiba_bhate](https://github.com/jotibabhate04/CodeSentinel_jyotiba_bhate)
