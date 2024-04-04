import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  connectTimeoutMS: 5000,
};

const client = new MongoClient(uri, options);

export default client;
