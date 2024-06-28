import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId, //Id of the product that we want to like
    refPath: "types", //Any name you can place instead of "Types"
  },
  types: {
    type: String,
    enum: ["Product", "Category"],
  },
})
  .pre("save", (next) => {
    console.log("New like coming in..");
    next();
  })
  .post("save", (doc) => {
    console.log("Like is saved");
    console.log(doc);
  })
  .pre("find", (next) => {
    console.log("Retriving likes");
    next();
  })
  .post("find", (docs) => {
    console.log("Find is Completed");
    console.log(docs);
  });
