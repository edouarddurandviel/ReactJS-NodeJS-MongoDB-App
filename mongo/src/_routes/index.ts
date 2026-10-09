import express from "express";
import UsersRoutes from "./user/user";
import CompanyRoutes from "./company/company";
import RemoteRoutes from "./remote/remote";
import { Server } from "socket.io";
import { sessionToken } from "@middleware/sessionToken";

export default (io: Server) => {
  const app = express.Router({
    mergeParams: false,
    caseSensitive: true,
    strict: true
  });

  app.use("/company", sessionToken, CompanyRoutes());
  app.use("/user", UsersRoutes());
  app.use("/remote", RemoteRoutes());

  return app;
};
