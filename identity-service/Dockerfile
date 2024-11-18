# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Run stage
FROM openjdk:21-jdk-slim

RUN apt-get update && apt-get install -y netcat-traditional curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /app/target/*.jar ./app.jar

EXPOSE 8087

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8087/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]