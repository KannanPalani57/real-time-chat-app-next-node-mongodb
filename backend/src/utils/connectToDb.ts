import mongoose from "mongoose";
import config from "config";
import log from "./logger";

async function connectToDb() {
  const dbUri = config.get<string>("dbUri");
  console.log(dbUri);

  try {
    await mongoose.connect(dbUri, {
      socketTimeoutMS: 45000,
      keepAlive: true,
    });
    log.info("Connected to DB");
  } catch (e) {
    console.log(e);

    process.exit(1);
  }
}

export default connectToDb;
