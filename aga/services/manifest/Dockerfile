FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install || (echo "no lockfile, installing deps" && npm install)
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc -p .
EXPOSE 3004
CMD ["node","dist/index.js"]
