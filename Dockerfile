# Dockerfile
FROM node:18 as base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Instalação global do CLI do NestJS
RUN npm install -g @nestjs/cli

# Use o base como base para o desenvolvimento
FROM base as development
CMD ["npm", "run", "start:dev"]
