import "dotenv/config"
import z from "zod";

const envSchema = z.object({
  API_URL: z.url().default("http://localhost:8080"),
})

const _env = envSchema.safeParse(process.env)

if(!_env.success) {
  throw new Error("Configure seu env!");
}

export const env = _env.data;