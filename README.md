# 🏦 Full-Stack Banking System

A comprehensive banking application built with modern technologies, featuring a robust Spring Boot backend and an intuitive React frontend. This monorepo architecture provides a complete solution for digital banking operations with enterprise-grade security and user experience.

## 🏗️ Architecture Overview

```
banking-system/
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite SPA
├── report/          # Technical documentation
```

## 🛠️ Technology Stack

### Backend Infrastructure
- **Java 17** - Latest LTS version for optimal performance
- **Spring Boot 3.x** - Production-ready application framework
- **Spring Security** - JWT-based authentication & authorization
- **PostgreSQL** - Flexible database configuration
- **Maven** - Dependency management and build automation

### Frontend Technology
- **Vite** - Lightning-fast build tool and dev server
- **React 18** - Modern component-based UI library
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first styling framework
- **shadcn/ui** - High-quality component library
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing solution

## 🚀 Quick Start Guide

### System Requirements
Ensure the following tools are installed:
- **Java 17+** ([Download](https://adoptium.net/))
- **Maven 3.6+** ([Download](https://maven.apache.org/))
- **Node.js 18+** & **npm** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Frontend Development Server

```bash
# Navigate to frontend directory
cd frontend

# Install project dependencies
npm install

# Start development server with hot reload
npm run dev
```

**Access the application:** [http://localhost:5173](http://localhost:5173)

### Backend Application Server

```bash
# Navigate to backend directory
cd backend

# Clean and build the project
mvn clean install

# Launch Spring Boot application
mvn spring-boot:run
```

**API Server:** [http://localhost:8080](http://localhost:8080)

> **Configuration:** Customize database and environment settings in `src/main/resources/application.properties`

## 🔐 Security Implementation

This application implements **JWT (JSON Web Token)** authentication for secure API access:

- **Token Generation:** Issued during successful login
- **Authorization Header:** Required for protected endpoints
- **Security Headers:** CORS, CSRF protection enabled
- **Role-Based Access:** Granular permission system

### Authentication Flow
1. User credentials validation
2. JWT token generation and signing
3. Automatic token refresh mechanism


### Production Configuration
```bash
# Build production frontend
npm run build

# Package Spring Boot application
mvn clean package -Pprod
```

## 📊 Project Documentation

Comprehensive technical documentation is available in the project repository:

📄 **[Download Technical Report (PDF)](./report/project-report.pdf)**

*Documentation includes system architecture, API specifications, database schema, and deployment guides.*

## 🤝 Contributing Guidelines

We welcome contributions from the developer community:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request



## 👨‍💻 Author & Contact

**Hamza ADDAMI**  
**Mohammed Amine KHAZRAJ**
*Junior Full-Stack Developer*

📍 **Location:** Casablanca, Morocco  


---

<div align="center">
  <strong>Built with ❤️ for the future of digital banking</strong>
</div>
