# ADENAI Travel Leave System - Docker Setup

This Docker setup containerizes both the frontend (React) and backend (Spring Boot) applications using your cloud database.

## Prerequisites

- Docker and Docker Compose installed on your system
- Your cloud database (sql12.freesqldatabase.com) should be accessible

## Database Configuration

The application is configured to connect to your cloud database:
- **Host**: sql12.freesqldatabase.com
- **Database**: sql12792194
- **Username**: sql12792194
- **Password**: Y5jpTigqBG

## Quick Start

1. **Build and run both services:**
   ```bash
   docker-compose up --build
   ```

2. **Run in detached mode (background):**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080

## Individual Service Management

### Build specific service:
```bash
# Build only backend
docker-compose build backend

# Build only frontend
docker-compose build frontend
```

### Run specific service:
```bash
# Run only backend
docker-compose up backend

# Run only frontend (requires backend to be running)
docker-compose up frontend
```

## Useful Commands

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

### Stop services:
```bash
docker-compose down
```

### Remove everything (containers, networks, images):
```bash
docker-compose down --rmi all --volumes --remove-orphans
```

### Rebuild and restart:
```bash
docker-compose down
docker-compose up --build
```

## Architecture

- **Frontend**: React app served by Nginx on port 80
- **Backend**: Spring Boot application on port 8080
- **Database**: External cloud MySQL database
- **Networking**: Both services communicate through a Docker bridge network

## Environment Variables

The backend uses the following environment variables (set in docker-compose.yml):
- `SPRING_PROFILES_ACTIVE=docker`
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

## Troubleshooting

1. **Port conflicts**: Make sure ports 80 and 8080 are not being used by other applications
2. **Database connection**: Ensure your cloud database is accessible and credentials are correct
3. **Build issues**: Try removing all Docker images and rebuilding:
   ```bash
   docker system prune -a
   docker-compose build --no-cache
   ```

## Development vs Production

This setup is optimized for production deployment. For development:
- Frontend uses nginx for serving static files
- Backend runs as a standalone JAR
- API calls are proxied through nginx from frontend to backend
