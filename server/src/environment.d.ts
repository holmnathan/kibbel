// TypeScript type definitions for environment variables (process.env)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: number;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
      CORS_ORIGIN_CLIENTS: string; // A JSON array of strings, must be split by "," when used.
    }
  }
}

export default ProcessEnv;
