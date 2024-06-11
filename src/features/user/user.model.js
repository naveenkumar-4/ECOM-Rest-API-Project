import ApplicationHandler from "../../Error-Handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class UserModel {
  constructor(name, email, password, type, id) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.type = type;
    this._id = id;
  }

  // static async signUp(name, email, password, type) {

  //   try{
  //     // 1.Get the database
  //     const db = getDB();
      
  //     // 2.Get the collection
  //     const collection = db.collection('users');
  //     const newUser = new UserModel(name, email, password, type);
      
  //     // 3.Insert the document.
  //     await collection.insertOne(newUser);
  //     return newUser;
  //   }catch(err){
  //     throw new ApplicationHandler("Something went wrong", 500);
  //   }
    
  // }

  // static signIn(email, password) {
  //   const user = users.find(
  //     (user) => user.email == email && user.password == password
  //   );
  //   return user;
  // }

  static getAll(){
    return users;
  }
}

var users = [
  {
    name: "Seller User",
    email: "seller@ecom.com",
    password: "Password1",
    type: "seller",
    id : 1,
  },
  {
    name: "Customer User",
    email: "customer@ecom.com",
    password: "Password1",
    type: "customer",
    id : 2,
  },
];
