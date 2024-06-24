import { app } from "./index.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import dotenv from 'dotenv'
import { connectToMongoose } from "./src/config/mongooseConfig.js";
dotenv.config();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
  // connectToMongoDB();
  connectToMongoose();
});
