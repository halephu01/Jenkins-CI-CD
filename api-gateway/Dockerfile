# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

COPY .mvn/ .mvn
COPY pom.xml ./
COPY src ./src

RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:21-jdk-slim

COPY --from=build /app/target/*.jar ./app.jar

RUN apt-get update && apt-get install -y curl

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "/app.jar"]
