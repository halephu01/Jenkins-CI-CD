FROM maven:3.9.6-amazoncorretto-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -f pom.xml

FROM openjdk:11-slim
WORKDIR /app
COPY --from=build /app/user-service/target/*.jar app.jar
EXPOSE 4040
ENTRYPOINT ["java", "-jar", "app.jar"]