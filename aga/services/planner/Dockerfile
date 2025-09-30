# --- Stage 1: build (devDeps 포함, TS 컴파일) ---
FROM node:20-alpine AS build
WORKDIR /app

# 1) 의존성 설치 (dev 포함)
COPY package*.json ./
RUN npm ci

# 2) 소스/설정 복사 후 컴파일
COPY tsconfig.json ./
COPY src ./src
# tsconfig.json의 outDir이 dist 여야 합니다.
RUN npx tsc -p tsconfig.json

# --- Stage 2: runtime (prodDeps만) ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# 3) 런타임 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev

# 4) 빌드 결과물만 복사
COPY --from=build /app/dist ./dist

# 5) 서비스 시작 (필요 시 경로/파일명 조정)
CMD ["node", "dist/index.js"]
