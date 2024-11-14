# ใช้ Node.js image เวอร์ชัน 18
FROM node:18 AS builder

# กำหนดโฟลเดอร์ทำงาน
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# ติดตั้ง dependencies
RUN npm install

# Build แอปสำหรับ production
RUN npm run build

# ใช้ Nginx เพื่อเสิร์ฟไฟล์ static
FROM nginx:alpine

# คัดลอกไฟล์ build ไปยัง Nginx directory
COPY --from=builder /app/build /usr/share/nginx/html

# คัดลอกไฟล์ Nginx configuration ถ้ามี
COPY nginx.conf /etc/nginx/nginx.conf

# เปิดพอร์ต 80
EXPOSE 80

# เริ่ม Nginx
CMD ["nginx", "-g", "daemon off;"]
