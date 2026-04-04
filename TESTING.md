# IncoSure Backend - API Testing Guide (STEP 7)

## 1) Start Backend

```bash
cd backend
mvn spring-boot:run
```

## 2) Postman Collection

Import:
- `backend/postman/IncoSure-API.postman_collection.json`

Set variable:
- `baseUrl = http://localhost:8080`

## 3) API Sequence (Required)

1. `POST /api/users/register`
2. `POST /api/policy/create`
3. `GET /api/claims`

## 4) Sample JSON Payloads

### A. Register User

**Endpoint**: `POST /api/users/register`

```json
{
  "name": "Ravi Kumar",
  "email": "ravi.kumar@example.com",
  "password": "Pass@123",
  "location": "Vijayawada",
  "deliveryType": "Swiggy",
  "zone": "Zone 5"
}
```

**Expected Response (201)**

```json
{
  "id": 1,
  "name": "Ravi Kumar",
  "email": "ravi.kumar@example.com",
  "location": "Vijayawada",
  "deliveryType": "Swiggy",
  "zone": "Zone 5"
}
```

### B. Create Weekly Policy

**Endpoint**: `POST /api/policy/create`

```json
{
  "userId": 1,
  "coverageAmount": 500
}
```

**Expected Response (201)**

```json
{
  "id": 1,
  "userId": 1,
  "weeklyPremium": 88.0,
  "coverageAmount": 500.0,
  "status": "ACTIVE"
}
```

> `weeklyPremium` is dynamically calculated by backend logic, so exact value can vary by profile.

### C. Get Claims (All)

**Endpoint**: `GET /api/claims`

**Expected Response (200)**

```json
[]
```

or

```json
[
  {
    "id": 1,
    "userId": 1,
    "policyId": 1,
    "triggerEventId": 1,
    "payoutAmount": 350.0,
    "status": "APPROVED",
    "createdAt": "2026-04-04T11:30:00"
  }
]
```

### D. Get Claims by User

**Endpoint**: `GET /api/claims?userId=1`

## 5) Scheduler Trigger Validation

Scheduler runs every 30s by default using:
- `app.scheduler.monitor-interval-ms=30000`

To generate claims automatically:
1. Ensure at least one user + active policy exists.
2. Configure `openweather.api.key` in `application.properties`.
3. Use a location with rain/high heat conditions.
4. Wait 30-90 seconds, then call `GET /api/claims`.

## 6) Common Issues

- **DB auth error**: Update `spring.datasource.username/password`.
- **No claims generated**: API key missing or no disruption weather detected.
- **CORS issue from frontend**: confirm `app.cors.allowed-origins=http://localhost:5173`.
