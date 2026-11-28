# CodeSentinel — Three-Tier Task Management Application

CodeSentinel is a three-tier task management application built with **React**, **Node.js/Express**, and **MySQL**. The project demonstrates a DevOps delivery workflow using **Docker Compose, Jenkins, GitHub Webhooks, SonarQube, Trivy, Ansible, Terraform configuration, and AWS EC2**.

> **Project status:** The application is deployed on AWS EC2. The Jenkins pipeline has completed successfully, GitHub push webhook delivery was verified, Ansible deployment and application health checks passed, and the captured Trivy scans reported zero vulnerabilities for the selected backend and frontend images at scan time. SonarQube analysis ran; the captured Quality Gate status was **Failed** (48.8% coverage), so it is not represented as passed. Terraform configuration validation succeeded; this documentation does not claim that `terraform apply` provisioned the infrastructure.

## Contents
- [Application overview](#application-overview)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Application screenshots](#application-screenshots)
- [CI/CD workflow](#cicd-workflow)
- [Security and quality](#security-and-quality)
- [Deployment automation](#deployment-automation)
- [Terraform](#terraform)
- [Run locally](#run-locally)
- [Repository structure](#repository-structure)
- [Detailed documentation](docs/PROJECT_DOCUMENTATION.md)

## Application overview

The application supports user registration and login, JWT-protected access, task creation and management, status and priority tracking, search/filtering, and dashboard statistics. The backend exposes REST API endpoints and persists application data in MySQL.

## Architecture

```text
Developer
   | git push
   v
GitHub repository -- push webhook --> Jenkins CI/CD
                                      |-- Backend tests & coverage
                                      |-- Frontend tests & coverage
                                      |-- SonarQube analysis
                                      |-- Frontend production build
                                      |-- Docker image build
                                      |-- Trivy image vulnerability scans
                                      |-- Ansible deployment
                                      `-- HTTP health verification
                                               |
                                               v
                                          AWS EC2
                                      Docker Compose services
                                      |-- Frontend (NGINX)
                                      |-- Backend (Express)
                                      `-- MySQL 8
```

## Technology stack

| Layer / purpose | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MySQL 8 |
| Authentication | JWT, bcryptjs |
| Containers | Docker, Docker Compose |
| CI/CD | Jenkins |
| Source control / trigger | Git, GitHub, GitHub Webhooks |
| Code analysis | SonarQube |
| Image security scanning | Trivy |
| Deployment automation | Ansible |
| Cloud hosting | AWS EC2 (Ubuntu) |
| Infrastructure as Code configuration | Terraform (`infra/terraform/`) |

## Application screenshots

### Registration and login

![CodeSentinel registration](docs/screenshots/03-app-registration.webp)

![CodeSentinel login](docs/screenshots/04-app-login.webp)

### Dashboard and task creation

![CodeSentinel dashboard](docs/screenshots/05-app-dashboard.webp)

![Create task modal](docs/screenshots/06-create-task.webp)

## CI/CD workflow

A push to the configured GitHub repository sends a webhook event to Jenkins. Jenkins checks out the source and executes the pipeline defined in `Jenkinsfile`.

1. Git checkout
2. Backend dependency installation
3. Frontend dependency installation
4. Backend tests and coverage
5. Frontend tests and coverage
6. SonarQube analysis
7. Frontend build
8. Docker image build
9. Trivy security scan of backend and frontend images
10. Ansible deployment using Docker Compose
11. Frontend and backend health verification

### Jenkins pipeline evidence

![Jenkins pipeline stage view](docs/screenshots/07-jenkins-stage-view.webp)

![Jenkins pipeline overview](docs/screenshots/08-jenkins-pipeline-overview.webp)

### GitHub webhook

The repository webhook is configured for push events. The captured delivery shows an HTTP **200** response from the Jenkins webhook endpoint.

![GitHub webhook delivery](docs/screenshots/14-github-webhook-delivery.webp)

## Security and quality

### SonarQube

SonarQube is integrated into the Jenkins pipeline for static code analysis. The captured project overview reported **48.8% coverage** and **2.5% duplications**. The captured Quality Gate history shows a **Failed** result. This is reported transparently rather than described as a successful gate.

![SonarQube project overview](docs/screenshots/15-sonarqube-project-overview.webp)

![SonarQube issues](docs/screenshots/16-sonarqube-issues.webp)

![SonarQube activity](docs/screenshots/17-sonarqube-activity.webp)

![SonarQube Quality Gate history](docs/screenshots/18-sonarqube-quality-gate.webp)

### Trivy

Trivy scans the built backend and frontend Docker images for CRITICAL and HIGH vulnerabilities. The captured CLI reports show **0 vulnerabilities** for both selected images at the time of scanning. Results can change as base images and dependencies are updated; run the scans again for current results.

```bash
trivy image --scanners vuln --severity CRITICAL,HIGH codesentinel-backend:latest
trivy image --scanners vuln --severity CRITICAL,HIGH codesentinel-frontend:latest
```

![Trivy backend CLI scan](docs/screenshots/22-trivy-backend-cli.webp)

![Trivy frontend CLI scan](docs/screenshots/23-trivy-frontend-cli.webp)

## Deployment automation

### Ansible

Ansible runs the deployment playbook locally on the EC2 host. The playbook verifies the Compose file, executes `docker compose up -d --remove-orphans`, waits for the frontend HTTP response, checks the backend `/api/health` endpoint, and reports deployment status.

```text
ansible/
├── ansible.cfg
├── inventory/
│   └── hosts.ini
└── playbooks/
    └── deploy.yml
```

Useful validation commands:

```bash
ansible --version
ANSIBLE_CONFIG=ansible/ansible.cfg ansible-inventory -i ansible/inventory/hosts.ini --list
ANSIBLE_CONFIG=ansible/ansible.cfg ansible-playbook -i ansible/inventory/hosts.ini ansible/playbooks/deploy.yml --syntax-check
```

The captured Jenkins deployment completed with `ok=6`, `changed=1`, `unreachable=0`, and `failed=0`; frontend HTTP status was 200 and backend health returned `UP`.

![Ansible CLI checks](docs/screenshots/20-ansible-cli-validation.webp)

![Ansible deployment in Jenkins](docs/screenshots/11-ansible-deployment-jenkins.webp)

### Docker Compose status

The captured `docker compose ps` output showed the frontend, backend, and MySQL services running and healthy.

![Docker Compose service status](docs/screenshots/19-docker-compose-status.webp)

## Terraform

Terraform configuration is maintained in `infra/terraform/`. The captured environment reported Terraform **1.17.2** and AWS provider **6.74.0**. Formatting check completed without reported changes and `terraform validate` returned `Success! The configuration is valid.`

This evidence confirms configuration validation only; it does not demonstrate that `terraform apply` created or managed the currently running EC2 resources.

```bash
cd infra/terraform
terraform version
terraform fmt -check
terraform validate
```

![Terraform validation](docs/screenshots/21-terraform-validation.webp)

## AWS deployment

The application is hosted on an Ubuntu EC2 instance. The screenshots below show the instance and the configured security group. Review inbound rules and restrict administrative ports and Jenkins access to trusted sources before using the setup beyond a controlled demo. Do not publish credentials, private keys, `.env` files, or unredacted account details.

![AWS EC2 instance](docs/screenshots/02-aws-ec2-instance.webp)

![AWS Security Group](docs/screenshots/01-aws-security-group.webp)

## Run locally

### Prerequisites
- Git
- Node.js and npm versions compatible with the package files
- MySQL 8 (or Docker and Docker Compose if using the Compose setup)

### 1. Clone the repository

```bash
git clone https://github.com/jotibabhate04/CodeSentinel_jyotiba_bhate.git
cd CodeSentinel_jyotiba_bhate
```

### 2. Configure environment variables

Use the example files as templates and add your own local values. Never commit actual `.env` files or secrets.

```bash
cp backend/.env.example backend/.env
```

### 3. Install dependencies and start services

Follow the backend and frontend package scripts in their respective `package.json` files. For the EC2/container deployment, use the repository's `docker-compose.yml` and the environment variables documented in `.env.example`.

## Repository structure

```text
.
├── ansible/
│   ├── ansible.cfg
│   ├── inventory/hosts.ini
│   └── playbooks/deploy.yml
├── backend/
├── database/
├── frontend/
├── infra/terraform/
├── docs/
│   ├── PROJECT_DOCUMENTATION.md
│   └── screenshots/
├── docker-compose.yml
├── Jenkinsfile
├── sonar-project.properties
└── README.md
```

## Detailed documentation

See **[Project Documentation](docs/PROJECT_DOCUMENTATION.md)** for architecture details, pipeline explanations, validation evidence, and the screenshot index.

## Future improvements

- Resolve the SonarQube Quality Gate failure and improve test coverage.
- Add HTTPS/TLS and harden Jenkins access.
- Add monitoring and centralized logging.
- Extend infrastructure provisioning and lifecycle management through Terraform after reviewing the plan.
- Consider Kubernetes deployment as a future enhancement.
