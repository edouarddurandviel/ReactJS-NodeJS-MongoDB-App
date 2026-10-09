import { expect, jest, test } from "@jest/globals";
import { Server } from "socket.io";
import CompanyController from "../../services/company";

const io = new Server();
const companyServices = new CompanyController(io);

describe("insert", () => {
  beforeAll(async () => {});

  afterAll(async () => {});

  it("should insert a doc into collection", async () => {
    let spy = jest.spyOn(companyServices, "getCompanies");
    expect(spy).toEqual(true);
  });
});
