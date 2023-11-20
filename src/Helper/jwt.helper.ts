import jwt from "jsonwebtoken";

const jwtHelper = {
  generateToken: (userData: any, secretSignature: string, tokenLife: string) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { data: userData },
        secretSignature,
        {
          algorithm: "HS256",
          expiresIn: tokenLife,
        },
        (error, token) => {
          if (error) return reject(error);

          return resolve(token);
        }
      );
    });
  },
  verifyToken: (token: string, secretKey: string) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (error, decoded) => {
        if (error) return reject(error);

        return resolve(decoded);
      });
    });
  },
};

export { jwtHelper };
