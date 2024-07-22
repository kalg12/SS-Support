import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "app_service_social_ultras3cre3t";

type TokenPayload = {
  id: number;
  rol: string;
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (typeof decoded !== "object" || !("id" in decoded)) {
      return null;
    }

    return decoded as TokenPayload;
  } catch (error) {
    return null;
  }
};
