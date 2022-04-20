// TypeScript type definitions for environment variables (process.env)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: number; // Coerce to number before use
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      CORS_ORIGIN_CLIENTS: string; // A JSON array of strings, must be split by "," before use.
      TYPEORM_CONNECTION: string;
      TYPEORM_HOST: string;
      TYPEORM_PORT: number; // Coerce to number before use
      TYPEORM_USERNAME: string;
      TYPEORM_PASSWORD: string;
      TYPEORM_DATABASE: string;
      TYPEORM_LOGGING: boolean;
      TYPEORM_SYNCHRONIZE: boolean;
      TYPEORM_MIGRATIONS_DIR: string;
      TYPEORM_SUBSCRIBERS_DIR: string;
      TYPEORM_ENTITIES_DIR: string;
      TYPEORM_MIGRATIONS: string;
      TYPEORM_SUBSCRIBERS: string;
      TYPEORM_ENTITIES: string;
      SALT_ROUNDS: number; // Coerce to number before use
    }
  }
}

export { };
