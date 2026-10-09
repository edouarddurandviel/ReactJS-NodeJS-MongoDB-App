import * as mongo from "mongodb";

export const collections: {
  user?: mongo.Collection;
} = {};

export type CreateUser = {
  email: string;
  password: string;
  salt?: string;
  name?: string;
};

export type AuthUser = {
  email: string;
  password: string;
  _id: string;
};

export type UserData = {
  email: string;
  password: string;
  _id: string;
};

export type UserYoken = {
  _id: string;
  token: string;
  user_id: string;
};
