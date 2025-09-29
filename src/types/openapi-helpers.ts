import type { operations, components } from './generated/api';

// Helpers to extract strongly-typed request/response shapes from openapi-typescript output
export type OkJson<O extends keyof operations> = operations[O]['responses'][200] extends { content: any }
  ? operations[O]['responses'][200]['content']['*/*']
  : never;

export type ReqJson<O extends keyof operations> = operations[O] extends { requestBody: { content: { 'application/json': any } } }
  ? operations[O]['requestBody']['content']['application/json']
  : never;

export type PathParams<O extends keyof operations> = operations[O] extends { parameters: { path: infer P } } ? P : never;
export type QueryParams<O extends keyof operations> = operations[O] extends { parameters: { query: infer Q } } ? Q : never;
export type HeaderParams<O extends keyof operations> = operations[O] extends { parameters: { header: infer H } } ? H : never;

export type Schemas = components['schemas'];
