import { RequestHandler } from "express";
import * as jwt from "jsonwebtoken";
import { NotFound } from "http-json-errors";
import * as userActions from "@services/user/actions";

export const sessionToken: RequestHandler = async (
  req: any,
  res: any,
  next: any
): Promise<void> => {
  try {
    if (req.cookies.jwt) {
      const secret = process.env.ENV_SECRET;
      if (secret) {
        const decode = (await jwt.verify(req.cookies.jwt, secret)) as any;
        if (decode) {
      
          const user = (await userActions.getUserTokenWithId(decode.Session_Id));
      
          if (user) {
       
            const isValid = new Date(parseInt(decode.exp)) > new Date();
            if (isValid) {
       
              req.user = user;
              next();
            } else {
              throw new NotFound("Session expiry");
            }
          } else {
            throw new NotFound("Unauthorized user session token");
          }
        } else {
          throw new NotFound("Unauthorized session token");
        }
      }
    } else {
      throw new NotFound("Need a session token");
    }
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
