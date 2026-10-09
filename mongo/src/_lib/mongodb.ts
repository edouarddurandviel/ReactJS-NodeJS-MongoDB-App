import { MongoClient, Db, Collection } from "mongodb";
import config from "../_config/mongodb";
import { isEnv } from "../_utils/isEnv";

const dbName = config.db || "test";

const uri = isEnv("github")
  ? "mongodb://root:edouard@mongodb:27017/test?authSource=admin"
  : config.uri || "mongodb://localhost:27017";

let client: MongoClient;
let db: Db;


// 100 users and each user makes about 10 connections requests per day, 
// which means 1000 requests/day, 
// light workload MongoDB connection pool.

export const connectToDatabase = async () => {
  if (db) return;
  client = new MongoClient(uri, {
      maxPoolSize: 10, // increase for long runnig, hendreds per/s, multi-sharing the app
      minPoolSize: 2,
      maxIdleTimeMS: 30000, // 30 seconds
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });
  if (process.env.NODE_ENV === "development") {
    const admin = client.db().admin();
    const result = await admin.command({ ping: 1 });

    console.log("dev mode. Mongo isConnection: " + result.ok);

    if (result.ok !== 1) {
      await client.connect();
    }
  } else {
    await client.connect();
  }

  db = client.db(dbName);
  return db;
};

export const closeDatabase = async () => {
  if (client) {
    await client.close();
  }
};

export const inCollection = async (collection: string) => {
  const list: Collection = await db.collection(collection);
  return list;
};

export const dbase = async () => {
  console.log(db);
  return db;
};
