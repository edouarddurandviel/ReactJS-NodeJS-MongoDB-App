import { Company, User, UserToken } from "../../../_interfaces/models";
import { CreateUser } from "../../../_interfaces/user";
import { inCollection } from "@libs/mongodb";
import { ObjectId } from "mongodb";

export const getOneUser = async (userId: string) => {
  const userCollection = await inCollection("user");
  const user = (await userCollection.findOne({ _id: new ObjectId(userId) })) as unknown as User;
  return user;
};

export const getOneUserWithEmail = async (email: string) => {
  const userCollection = await inCollection("user");
  const user = (await userCollection.findOne({ email: email })) as unknown as User;
  return user;
};

export const getAllUsers = async () => {
  const userCollection = await inCollection("user");
  const users = (await userCollection
    .find({})
    .sort({ email: 1 })
    .toArray()) as unknown as Company[];
  return users;
};

export const getSomeUsers = async (limit: number) => {
  const userCollection = await inCollection("user");

  const users = (await userCollection
    .find({})
    .sort({ email: 1 })
    .limit(limit)
    .toArray()) as unknown as Company[];

  return users;
};

export const getUserWithSomeEmails = async (email: string) => {
  const userCollection = await inCollection("user");

  const users = (await userCollection
    .find({
      $or: [{ email: email }, { email: "default@email.com" }]
    })
    .toArray()) as unknown as Company[];

  return users;
};
export const getUserData = async (userId: string) => {
  const userCollection = await inCollection("user");
  const user = await userCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "token",
          localField: "_id",
          foreignField: "user_id",
          as: "myToken"
        }
      },
      {
        $unwind: {
          path: "$myToken",
          preserveNullAndEmptyArrays: true
        }
      }
    ])
    .toArray();

  return user;
};

export const getUserRole = async (userId: string) => {
  const userCollection = await inCollection("roles");
  const user = await userCollection.findOne({ user_id: new ObjectId(userId) });

  return user;
};

export const countUsers = async () => {
  const userCollection = await inCollection("user");
  const count = await userCollection.aggregate([
    { $exist: { email: true } },
    { $count: "summed_users" }
  ]);

  return count;
};

export const createOneUser = async (data: CreateUser) => {
  const userCollection = await inCollection("user");
  const user = await userCollection.insertOne(data);
  return user;
};

export const createProfil = async (data: any, userId: string) => {
  const userCollection = await inCollection("profil");

  const user = await userCollection.insertOne({
    ...data,
    _id: new ObjectId(userId)
  });
  return user;
};

export const searchForOneUser = async (email: string) => {
  const userCollection = await inCollection("user");
  const search = `/${email}/`;
  const searchedUser = (await userCollection
    .find({ email: search })
    .toArray()) as unknown as User[];
  return searchedUser;
};

/**
 *
 * @param token
 * @param userId
 * @returns user object
 */
export const storeUserToken = async (token: string, userId: ObjectId) => {
  const userCollection = await inCollection("token");
  const user = await userCollection.insertOne({
    token: token,
    userId: new ObjectId(userId)
  });
  return user;
};

export const getUserToken = async (token: string) => {
  const userCollection = await inCollection("token");
  const userToken = (await userCollection.findOne({
    token: token
  })) as unknown as UserToken;
  return userToken;
};

export const getUserTokenWithId = async (sessionId: string) => {

  const userCollection = await inCollection("token");
  const user = (await userCollection.findOne({
    token: sessionId
  })) as unknown as UserToken;

  return user;
};

export const getUserWithId = async (userId: string) => {

  const userCollection = await inCollection("token");
  const user = (await userCollection.findOne({
    userId: new ObjectId(userId)
  })) as unknown as UserToken;

  return user;
};

export const deleteUserToken = async (userId: string) => {
  const userCollection = await inCollection("token");
  const user = await userCollection.deleteOne({
    userId: new ObjectId(userId)
  });
  return user;
};
