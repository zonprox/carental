import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default(() => 'development' as const),
  APP_URL: z.string().url().default('http://localhost:3000'),
  SERVER_PORT: z.string().regex(/^\d+$/).transform(Number).default(() => 4000),
  CLIENT_PORT: z.string().regex(/^\d+$/).transform(Number).default(() => 5173),
  DATABASE_URL: z.string().url().default('postgresql://user:password@localhost:5432/database'),
  JWT_SECRET: z.string().min(8).default('supersecretjwtkey'),
  INIT_ADMIN_EMAIL: z.string().email().optional().or(z.literal('')),
  INIT_ADMIN_PASSWORD: z.string().optional().or(z.literal('')),
  INIT_ADMIN_NAME: z.string().optional().or(z.literal('')).default(() => 'Administrator'),
});

export type Env = z.infer<typeof envSchema>;

export function validateEnv(processEnv: NodeJS.ProcessEnv): Env {
  const result = envSchema.safeParse(processEnv);
  
  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    throw new Error('Invalid environment variables');
  }
  
  return result.data;
}

export const env = validateEnv(process.env);
