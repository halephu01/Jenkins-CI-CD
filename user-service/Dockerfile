FROM maven:3.9.6-amazoncorretto-21 AS build
WORKDIR /app
COPY pom.xml .
COPY user-service user-service/
RUN mvn clean package -f user-service/pom.xml

FROM openjdk:11-slim
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
EXPOSE 4040
ENTRYPOINT ["java", "-jar", "app.jar"]