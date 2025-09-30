# AGA on n8n – 실행 가능한 스켈레톤

## 요구사항
- Docker & Docker Compose
- 포트: 5678 (n8n), 8080 (Gateway), 3001~3004 (서비스)

## 실행
```bash
docker compose up --build -d
# n8n: http://localhost:5678
# API Gateway: http://localhost:8080
```

## 테스트
1) n8n에서 `n8n/workflows/aga_example.json`을 Import 후 활성화합니다.
2) 아래 호출로 시작합니다.
```bash
curl -X POST http://localhost:5678/webhook/aga/start  -H 'Content-Type: application/json'  -H 'X-Tenant: demo'  -d '{"prompt":"지원서 이메일에서 후보 정보를 추출해 시트에 정리하고 기준 충족 시 면접을 잡아줘","constraints":["PII 마스킹","월 비용 20USD"]}'
```
3) 필요한 경우 `http://localhost:5678/webhook/aga/approve`로 승인합니다.
