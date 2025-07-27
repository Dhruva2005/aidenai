<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Employee Travel & Leave Approval System

This is a full-stack web application built with React.js frontend and Spring Boot backend for managing employee travel requests and leave approvals.

## Project Structure
- `/frontend` - React.js TypeScript application with Material-UI components
- `/backend` - Spring Boot Java application with JPA, MySQL, and JWT authentication

## Technologies
- **Frontend**: React.js, TypeScript, Material-UI, Axios, React Router
- **Backend**: Spring Boot, Java 17, Spring Security, JWT, JPA/Hibernate, MySQL
- **Authentication**: JWT tokens with role-based access control

## Key Features
- Role-based authentication (Employee/Manager)
- Travel request creation and management
- Leave balance tracking
- Manager approval/rejection workflow
- Real-time status updates

## API Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/travel` - Create travel request
- `GET /api/travel/myrequests` - Get user's requests
- `GET /api/travel/all` - Manager: Get all requests
- `PUT /api/travel/{id}/approve` - Manager: Approve request
- `PUT /api/travel/{id}/reject` - Manager: Reject request
- `GET /api/users/me` - Get current user info
- `GET /api/users/{id}/leaves` - Get user leave balance

## User Roles
- **Employee**: Can create travel requests and view their own requests
- **Manager**: Can view, approve, and reject travel requests from their team

## Demo Accounts
- Manager: manager@company.com / password123
- Employee: alice@company.com / password123
- Employee: bob@company.com / password123

## Development Notes
- Use Material-UI components for consistent styling
- Follow REST API conventions
- Implement proper error handling and validation
- Use TypeScript interfaces for type safety
- Follow Spring Boot best practices for backend development
