import ApplicationHandler from "../../Error-Handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";


export default class UserRepository {

  constructor(){
    this.collection = "users";
  }

  async signUp(newUser) {
    try {
      // 1.Get the database
      const db = getDB();

      // 2.Get the collection
      const collection = db.collection(this.collection);

      // 3.Insert the document.
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with database", 500);
    }
  }

  async signIn(email, password) {
    try {
      // 1.Get the database
      const db = getDB();

      // 2.Get the collection
      const collection = db.collection(this.collection);

      // 3.find the document.
      return await collection.findOne({email, password});
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      // 1.Get the database
      const db = getDB();

      // 2.Get the collection
      const collection = db.collection("users");

      // 3.find the document.
      return await collection.findOne({email});
    } catch (err) {
      console.log(err);
      throw new ApplicationHandler("Something went wrong with database", 500);
    }
  }
}
