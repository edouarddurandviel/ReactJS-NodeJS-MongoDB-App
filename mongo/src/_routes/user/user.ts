import express, { Request, Response } from "express";
import { ExtendedRequest } from "../../_interfaces/requests";
import * as userSchemas from "../../_joiSchemas/users";
import { handleErrors } from "@libs/server";
import { sessionToken } from "@middleware/sessionToken";
import UserController from "@controllers/user";
import { Server } from "socket.io";
import { Storage } from "@google-cloud/storage";
import config from "../../_config/google";

export default (io: Server) => {
  const router = express.Router({
    mergeParams: false,
    caseSensitive: true,
    strict: true
  });

  const userServices = new UserController(io);

  /* users pages. */
  router.post("/create", async (req: ExtendedRequest, res: Response) => {
    try {
      const data = await userSchemas.user.validateAsync(req.body);
      const result = await userServices.createOneUser(data);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/login", async (req: Request, res: Response) => {
    try {
      const email = await userSchemas.textSchema.validateAsync(req.query.email);
      const password = await userSchemas.textSchema.validateAsync(req.query.password);

      const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days
      const result = await userServices.login(email, password, maxAge);

      res.cookie("jwt", result.token, {
        maxAge: maxAge,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
      });

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.post("/logout/:userId", async (req: Request, res: Response) => {
    try {
      const data = await userSchemas.uidSchema.validateAsync(req.params.userId);
      console.log(data)
      await userServices.logout(data);

      res.clearCookie("jwt");
      res.status(200).json({ err: false });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.post("/profil/:userId/create", sessionToken, async (req: Request, res: Response) => {
    try {
      const userId = await userSchemas.uidSchema.validateAsync(req.params.userId);
      const result = await userServices.createProfil(req.body, userId);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/all", sessionToken, async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await userServices.getAllUsers();

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/:userId", sessionToken, async (req: ExtendedRequest, res: Response) => {
    try {
      const userId = await userSchemas.userId.validateAsync(req.params.userId);
      const result = await userServices.getUserData(userId);

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  router.get("/gcloud/picture", async (req: ExtendedRequest, res: Response) => {
    try {
      const options = {
        projectId: "progresswebapp-cf1d7",
        keyFilename: config.buckets.google || "default"
      };
      const storage = new Storage(options);
      const [buckets] = await storage.getBuckets();
      res.status(200).json({ err: false, data: buckets });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  return router;
};
