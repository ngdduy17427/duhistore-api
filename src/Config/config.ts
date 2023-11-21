declare global {
  namespace Express {
    interface Request {
      jwtDecoded: any;
    }
  }
}

export const config = {
  rateLimitConfig: {
    windowMs: 1 * 60 * 1000,
    max: 1000,
  },
  serverConfig: {
    SERVER_PORT: 8080,
  },
};
