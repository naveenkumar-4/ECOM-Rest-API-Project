import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import ApplicationHandler from "../../Error-Handler/applicationError.js";

const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async resetPassword(userID, hashedPassword) {
    try {
      let user = await UserModel.findById(userID);
      if (user) {
        user.password = hashedPassword;
        user.save();
      } else {
        throw new Error("No such user found");
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with dataBase");
    }
  }
  async signUp(user) {
    try {
      // Create instance of model
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        throw err;
      } else {
        console.log(err);
        throw new ApplicationHandler("Something went wrong with dataBase");
      }
    }
  }

  async signIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.log(err);
        throw err;
      } else {
        console.log(err);
        throw new ApplicationHandler("Something went wrong with dataBase");
      }
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
