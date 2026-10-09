import express, { Request, Response } from "express";
import CompanyController from "@controllers/company";
import { handleErrors } from "@libs/server";
import { remotePostAccess } from "@middleware/remoteAccess";
import { ExtendedRequest } from "../../_interfaces/requests";
import { Server } from "socket.io";

export default () => {
  const router = express.Router();

  const companyServices = new CompanyController();

  router.post("/remote/post", remotePostAccess, async (req: ExtendedRequest, res: Response) => {
    try {
      const result = await companyServices.getCompanyLogs();

      res.status(200).json({ err: false, data: result });
    } catch (error: any) {
      handleErrors(error);
    }
  });

  return router;
};
