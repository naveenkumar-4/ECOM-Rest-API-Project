import { app } from "./index.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import dotenv from 'dotenv'
dotenv.config();
const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
  connectToMongoDB();
});
