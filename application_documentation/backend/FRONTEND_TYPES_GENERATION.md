# Frontend OpenAPI Type Generation

This documents how to generate TypeScript types from the backend OpenAPI and use them in the React app.

## Prerequisites
- Backend running locally with OpenAPI enabled (see Swagger at http://localhost:8080/swagger-ui.html)

## Generate types
```bash
# from StudentHubApplication-Frontend
npm run openapi:types
# outputs: src/types/generated/api.d.ts
```

## Using generated types
- Import type containers from the generated file:
```ts
import type { components } from "../../types/generated/api"; // adjust path from your file

type AuthResponse = components["schemas"]["AuthResponse"]; // matches backend DTO name
```
- Use in Axios calls:
```ts
const res = await api.post<AuthResponse>("/auth/login", body);
```

## Tips
- If schema names differ, search the generated `api.d.ts` for the expected DTO name.
- Re-run `npm run openapi:types` whenever backend DTOs/controllers change.
- Commit `src/types/generated/api.d.ts` if you want stable CI builds without requiring backend at generation time (optional).
