import * as mongo from "mongodb";
import { CreateCompany } from "../_interfaces/company";
import * as companyActions from "../services/company/actions";
import * as companySockets from "../services/company/sockets/clients";
import { getObject } from "../services/aws/s3/getObject";
import path from "path";
import { open } from "fs/promises";

class CompanyController {
 
  public async getDocuments() {
    const documents = await getObject("test", "document.jpg");
    return documents;
  }

  public async getOneCompany(companyId: string) {
    const result = await companyActions.findOneCompany(companyId);

    return result;
  }

  public async getCompanies() {
    const companies = await companyActions.getAllCompanies();
    return companies;
  }

  public async createOneCompany(company: CreateCompany) {
    // define price using company name length
    const newPrice = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
    const len = company.ref.length;

    company.publicPrice = newPrice.format(len);
    company.price = mongo.Decimal128.fromString(len.toFixed(2));

    await companyActions.createOneCompany(company);
    companySockets.reloadCompanies();
  }

  public async updateOneCompany(companyId: string, data: CreateCompany) {
    await companyActions.updateOneCompany(companyId, data);

    companySockets.reloadCompanies();
  }

  public async updateManyCompanies(companyId: string, data: CreateCompany) {
    await companyActions.updateManyCompany(companyId, data);

    companySockets.reloadCompany(1, {
      params: {
        userId: 1
      }
    });
  }

  public async replaceOneCompany(companyId: string, data: CreateCompany) {
    await companyActions.replaceOneCompany(companyId, data);

    companySockets.reloadCompanies();
  }

  public async deleteOneCompany(companyId: string) {
    await companyActions.deleteOneCompany(companyId);

    companySockets.reloadCompanies();
  }

  public async getCompanyLogs() {
    const docPath = path.resolve("isolate-000001A595F92050-14492-v8.log");
    const doc = await open(docPath);
    for await (const line of doc.readLines()) {
      console.log(line);
    }

    return doc;
  }
}

export default CompanyController;
