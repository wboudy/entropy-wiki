FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev

EXPOSE 3001
CMD ["npm", "start"]
