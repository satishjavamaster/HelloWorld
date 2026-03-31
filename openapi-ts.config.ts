import { defineConfig } from '@hey-api/openapi-ts';
import * as fs from 'node:fs';

// Convert snake_case to camelCase
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

// Build per-schema patches that rename all property keys to camelCase
function buildPropertyPatches() {
  const spec = JSON.parse(fs.readFileSync('./openapi.json', 'utf-8'));
  const schemas: Record<string, any> = spec.components?.schemas ?? {};
  const patches: Record<string, (schema: any) => void> = {};

  for (const schemaName of Object.keys(schemas)) {
    patches[schemaName] = (schema: any) => {
      if (!schema.properties) return;

      const renamed: Record<string, any> = {};
      for (const [key, value] of Object.entries(schema.properties)) {
        renamed[snakeToCamel(key)] = value;
      }
      schema.properties = renamed;

      if (Array.isArray(schema.required)) {
        schema.required = schema.required.map(snakeToCamel);
      }
    };
  }
  return patches;
}

export default defineConfig({
  input: './openapi.json',
  output: {
    path: './generated',
  },
  parser: {
    patch: {
      schemas: buildPropertyPatches(),
    },
  },
  plugins: [
    {
      name: '@hey-api/typescript',
      definitions: {
        case: 'PascalCase',
      },
    },
  ],
});
