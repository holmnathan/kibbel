// TypeScript type definitions for environment variables (process.env)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: number;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      CORS_ORIGIN_CLIENTS: string; // A JSON array of strings, must be split by "," when used.
      TYPEORM_CONNECTION: string;
      TYPEORM_HOST: string;
      TYPEORM_PORT: number;
      TYPEORM_USERNAME: string;
      TYPEORM_PASSWORD: string;
      TYPEORM_DATABASE: string;
      TYPEORM_LOGGING: boolean;
      TYPEORM_SYNCHRONIZE: boolean;
      TYPEORM_MIGRATIONS_DIR: string;
      TYPEORM_SUBSCRIBERS_DIR: string;
      TYPEORM_ENTITIES_DIR: string;
    }
  }
}

export default ProcessEnv;
