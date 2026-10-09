import { Unauthorized } from "http-json-errors";
import { CreateUser, UserData } from "../_interfaces/user";
import * as userActions from "../services/user/actions";
import { argon2Sync, randomBytes } from "node:crypto";
import * as jwt from "jsonwebtoken";
import { UserToken } from "../_interfaces/models";

class UserController {
  private _io;

  constructor(io: any) {
    this._io = io;
  }

  public async getAllUsers() {
    const user = await userActions.getAllUsers();
    return user;
  }

  public async createOneUser(data: CreateUser) {
    const salt = randomBytes(16);
    const secret = process.env.ENV_SECRET;

    const derivedKey = argon2Sync("argon2id", {
      message: data.password,
      nonce: salt,
      parallelism: 4,
      tagLength: 32,
      memory: 65536,
      passes: 3,
      secret: secret
    }).toString("hex");

    const dataHash = {
      email: data.email,
      password: derivedKey,
      salt: salt.toString("hex")
    };
    const user = await userActions.createOneUser(dataHash);

    return user;
  }

  public async createProfil(data: any, userId: string) {
    const user = await userActions.createProfil(data, userId);
    return user;
  }

  public async getUserData(userId: string) {
    const user = (await userActions.getUserData(userId)) as unknown as UserData[];
    return user;
  }

  public async getOneUserWithEmail(email: string) {
    const user = await userActions.getOneUserWithEmail(email);
    return user;
  }

  public async login(email: string, password: string, maxAge: any) {
    const user = await userActions.getOneUserWithEmail(email);
    const salt = Buffer.from(user.salt, "hex");

    const hash = argon2Sync("argon2id", {
      message: password,
      nonce: salt,
      parallelism: 4,
      tagLength: 32,
      memory: 65536,
      secret: process.env.ENV_SECRET,
      passes: 3
    });

    if (hash.toString("hex") === user.password) {
      // create jwt token
      const Session_Id = Date.now().toString();
      const payload = { Session_Id: Session_Id }; // session id
      const secret = process.env.ENV_SECRET;

      const token = secret && jwt.sign(payload, secret, { expiresIn: Date.now() + maxAge });

      token && (await userActions.storeUserToken(Session_Id, user._id));

     

      //const roles = await userActions.getUserData(user._id.toString());

      const userPermissions = {
        id: user._id,
        email: user.email
      };

      return { userPermissions, token };
    } else {
      throw new Unauthorized("Invalid email or password");
    }
  }

  public async logout(userId: string) {
    const data = (await userActions.getUserWithId(userId)) as unknown as UserToken;
    const result = await userActions.deleteUserToken(data.userId);
    return result;
  }
}

export default UserController;
