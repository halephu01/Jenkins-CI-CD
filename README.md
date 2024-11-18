# MICROservices PROJECT

Đây là một dự án MICROservices bao gồm các service sau:
- **API GATEWAY**
- **PRODUCT SERVICE**
- **INVENTORY SERVICE**
- **ORDER SERVICE**
- **IDENTITY SERVICE**
- **NOTIFICATION SERVICE**

## YÊU CẦU HỆ THỐNG

- **JAVA 21**
- **DOCKER**
- **DOCKER COMPOSE**
- **MAVEN**

## HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY

1. **CLONE REPOSITORY VỀ MÁY LOCAL:**

   ```bash
   git clone <repository_url>
   cd <project_folder>
   ```

2. **CHẠY DOCKER COMPOSE ĐỂ KHỞI ĐỘNG CÁC CONTAINER CẦN THIẾT:**

   ```bash
   docker-compose up -d
   ```

3. **CHẠY TỪNG SERVICE:**

   Đối với mỗi service (api-gateway, product-service, inventory-service, order-service, identity-service, notification-service), thực hiện các bước sau:

   ```bash
   cd <service_folder>
   mvn spring-boot:run
   ```

4. **TRUY CẬP API GATEWAY:**

   API Gateway sẽ chạy tại `http://localhost:9000` (hoặc port được cấu hình).

## CẤU TRÚC PROJECT

- `api-gateway`: **API GATEWAY SERVICE**
- `product-service`: **QUẢN LÝ SẢN PHẨM**
- `inventory-service`: **QUẢN LÝ KHO HÀNG**
- `order-service`: **QUẢN LÝ ĐƠN HÀNG**
- `identity-service`: **XÁC THỰC VÀ PHÂN QUYỀN**
- `notification-service`: **GỬI THÔNG BÁO**

## MONITORING

Dự án sử dụng **GRAFANA**, **PROMETHEUS**, và **LOKI** cho việc giám sát. Truy cập Grafana tại `http://localhost:3000`.

## FRONTEND

Frontend được phát triển bằng **REACT**. Để chạy frontend:
``` bash
cd frontend
npm install
npm start
```
Truy cập frontend tại `http://localhost:3500`
