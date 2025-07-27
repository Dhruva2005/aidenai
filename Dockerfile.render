# Simple backend-only Dockerfile for Render deployment
FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY backend/mvnw .
COPY backend/mvnw.cmd .
COPY backend/pom.xml .
COPY backend/.mvn .mvn

# Copy source code
COPY backend/src src

# Make mvnw executable
RUN chmod +x ./mvnw

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port that Render will provide
EXPOSE $PORT

# Run the application with Render's port
CMD java -Dserver.port=$PORT -jar target/travel-leave-system-0.0.1-SNAPSHOT.jar
