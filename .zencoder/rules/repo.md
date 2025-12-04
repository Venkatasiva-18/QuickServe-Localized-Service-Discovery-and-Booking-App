---
description: Repository Information Overview
alwaysApply: true
---

# Service Spot Repository Information

## Repository Summary

Service Spot is a full-stack web application for connecting service providers and customers. The repository is organized as a monorepo with two main projects: a React-based frontend and a Spring Boot backend, both connected to a MySQL database.

## Repository Structure

- **service-spot-frontend/**: React + Vite frontend application with pages (Login, Register, Customer Profile, Provider Profile, Admin Dashboard) and shared components (NavBar, Footer, Search)
- **Service-Spot/**: Spring Boot backend API with controllers (Customer, Provider, Hello), services, models, and repositories
- **Root pom.xml**: Maven configuration for managing build across projects
- **Maven Wrapper**: mvnw scripts for consistent Maven version usage

### Main Repository Components

- **Frontend**: React-based single-page application with role-based pages (customer, provider, admin)
- **Backend**: REST API with Spring Boot, security authentication, and MySQL persistence
- **Database**: MySQL (configured at localhost:3306/servicespot)

## Projects

### service-spot-frontend

**Configuration File**: `package.json`, `vite.config.js`

#### Language & Runtime

**Language**: JavaScript (JSX)  
**Runtime**: Node.js  
**Build System**: Vite 7.2.4  
**Package Manager**: npm

#### Dependencies

**Main Dependencies**:
- React 19.2.0
- React Router DOM 6.30.2
- React DOM 19.2.0
- React Icons 5.5.0

**Development Dependencies**:
- @vitejs/plugin-react 5.1.1
- Vite 7.2.4
- ESLint with React plugins

#### Build & Installation

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

#### Project Structure

- **src/pages/**: Page components (Login, Register, CustomerProfile, ProviderProfile, AdminDashboard, etc.)
- **src/components/**: Shared components (Navbar, Footer, Search)
- **src/App.jsx**: Main application entry point
- **src/main.jsx**: React DOM render entry point
- **public/**: Static assets
- **vite.config.js**: Vite configuration with React plugin

#### Testing

No test framework currently configured.

### Service-Spot (Backend)

**Configuration File**: `pom.xml`, `application.properties`

#### Language & Runtime

**Language**: Java  
**Version**: Java 21  
**Framework**: Spring Boot 4.0.0  
**Build System**: Maven  
**Package Manager**: Maven

#### Dependencies

**Main Dependencies**:
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Web MVC
- Spring Boot Starter Thymeleaf
- Thymeleaf Spring Security extras
- MySQL Connector/J
- Project Lombok
- Spring Boot DevTools

**Test Dependencies**:
- Spring Boot Starter Data JPA Test
- Spring Boot Starter Security Test
- Spring Boot Starter Thymeleaf Test
- Spring Boot Starter Web MVC Test

#### Build & Installation

```bash
mvn clean install
mvn spring-boot:run
mvn package
```

#### Database Configuration

**Database**: MySQL  
**URL**: jdbc:mysql://localhost:3306/servicespot  
**Username**: root  
**Password**: 12345  
**Hibernate DDL**: update  

#### Application Structure

- **src/main/java/Team/C/Service/Spot/**
  - **controller/**: CustomerController, ProviderController, HelloController
  - **model/**: Customer, Provider entity classes
  - **repositery/**: CustomerRepo, ProviderRepo (JPA repositories)
  - **services/**: CustomerService, ProviderService (business logic)
  - **config/**: SecurityConfig, CorsConfig
  - **ServiceSpotApplication.java**: Main entry point

#### Entry Point

**Main Class**: `Team.C.Service.Spot.ServiceSpotApplication.java`  
**Run Command**: `mvn spring-boot:run`

#### Testing

Test framework dependencies configured via Maven:
- Spring Boot test starters for data-jpa, security, thymeleaf, and web-mvc
- Tests typically located in `src/test/java`

**Run Tests**:
```bash
mvn test
```
