FROM maven:3.9.6-amazoncorretto-21 AS build
WORKDIR /app
COPY . . 
RUN mvn clean package -f aggregate-service/pom.xml

FROM openjdk:11-slim
WORKDIR /app
COPY --from=build /app/aggregate-service/target/*.jar app.jar
EXPOSE 5050
ENTRYPOINT ["java", "-jar", "app.jar"]