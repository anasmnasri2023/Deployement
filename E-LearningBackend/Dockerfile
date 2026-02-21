# ===== STAGE 1 : development =====
FROM node:16.14.2-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]   # ex: nodemon

# ===== STAGE 2 : production =====
FROM base AS prod
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
