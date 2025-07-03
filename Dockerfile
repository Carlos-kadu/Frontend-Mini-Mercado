# build
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install react-bootstrap bootstrap && npm run build

# produção
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 