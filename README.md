# React.js & Java Spring Boot Full-Stack Application

This application demonstrates how to build a modern full-stack application using **React.js with TypeScript** for the frontend and **Java Spring Boot** for the backend, with **PostgreSQL** as the database.

## 🏗️ **Project Structure**
- **Frontend**: React.js with TypeScript (`frontend/` folder)
- **Backend**: Java Spring Boot REST API (`backend/` folder)  
- **Database**: PostgreSQL (containerized)
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes manifests included

## 🚀 **Quick Start with Docker Compose**

### Prerequisites
- Docker & Docker Compose installed
- Ports 3000, 8080, and 5434 available

### Run the Application
```bash
# Clone and navigate to project
git clone <your-repo-url>
cd springbootcamp

# Start all services (database, backend, frontend)
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild all
```

### 🌐 **Access Points**
- **Frontend (React)**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5434 (PostgreSQL)

## ☸️ **Kubernetes Deployment**

### Prerequisites
- Kubernetes cluster (minikube, kind, or cloud provider)
- kubectl configured

### Deploy to Kubernetes
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/

# Or apply individually
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check deployment status
kubectl get pods
kubectl get services

# View application logs
kubectl logs -l app=springboot-backend
kubectl logs -l app=react-frontend

# Port forward to access services locally
kubectl port-forward service/frontend-service 3000:80
kubectl port-forward service/backend-service 8080:8080
kubectl port-forward service/postgres-service 5432:5432
```

### 🔍 **Kubernetes Access**
After port-forwarding:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

## 🛠️ **Development Setup**

### Backend Development (Spring Boot)
```bash
cd backend

# Using Maven Wrapper
./mvnw spring-boot:run

# Or using Maven directly
mvn spring-boot:run

# Run tests
./mvnw test
```

### Frontend Development (React + TypeScript)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Type check
npm run type-check
```

### Database Setup (Local PostgreSQL)
```bash
# Using Docker only
docker run --name postgres-local \
  -e POSTGRES_DB=myapp \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5434:5432 \
  -d postgres:15-alpine

# Connect to database
psql -h localhost -p 5434 -U user -d myapp
```

## 📋 **Environment Configuration**

### Backend Configuration
The Spring Boot application uses these default database settings:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5434/myapp
spring.datasource.username=user
spring.datasource.password=password
```

### Docker Environment Variables
Customize in `docker-compose.yml`:
```yaml
environment:
  - POSTGRES_DB=myapp
  - POSTGRES_USER=user
  - POSTGRES_PASSWORD=password
  - SPRING_PROFILES_ACTIVE=docker
```

## 🐳 **Docker Commands**

### Build Images Individually
```bash
# Build backend
docker build -t springboot-backend ./backend

# Build frontend  
docker build -t react-frontend ./frontend

# Run with custom network
docker network create springboot-network
docker run --network springboot-network -d --name postgres-db \
  -e POSTGRES_DB=myapp -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password \
  postgres:15-alpine
```

### Docker Compose Operations
```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build backend

# View service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Scale services (if needed)
docker-compose up --scale backend=2

# Remove all containers and volumes
docker-compose down -v
```

## 🧪 **Testing**

### Backend Tests
```bash
cd backend
./mvnw test
./mvnw test -Dtest=UserControllerTest
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

### Integration Testing
```bash
# Ensure all services are running
docker-compose up -d

# Test backend API
curl http://localhost:8080/api/health

# Test frontend
curl http://localhost:3000
```

## 🚨 **Troubleshooting**

### Common Issues

**Port Conflicts:**
```bash
# Check what's using ports
sudo lsof -i :3000
sudo lsof -i :8080
sudo lsof -i :5434

# Kill processes if needed
sudo kill -9 <PID>
```

**Docker Issues:**
```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Restart Docker Compose
docker-compose down
docker-compose up --build
```

**Database Connection Issues:**
```bash
# Check database logs
docker-compose logs database

# Connect to database container
docker-compose exec database psql -U user -d myapp
```

## 📚 **Technology Stack**

- **Frontend**: React 18, TypeScript, Nginx
- **Backend**: Java 17, Spring Boot 3.x, Maven
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes
- **Testing**: Jest, JUnit 5

## 🎯 **Learning Objectives**

Use this project to understand:
- Full-stack application architecture
- REST API design with Spring Boot
- React component development with TypeScript
- Database integration with JPA/Hibernate
- Containerization with Docker
- Orchestration with Kubernetes
- Modern development workflows

---

**Happy coding! 🚀** Start with `docker-compose up` and begin exploring the codebase.