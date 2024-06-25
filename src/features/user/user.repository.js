import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import ApplicationHandler from "../../Error-Handler/applicationError.js";

const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async signUp(user) {
    try {
      // Create instance of model
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with dataBase");
    }
  }

  async signIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with dataBase");
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with database", 500);
    }
  }
}
