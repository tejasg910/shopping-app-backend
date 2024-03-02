import mongoose from "mongoose";
export const connectDb = () => {
    mongoose
        .connect("mongodb+srv://admin:admin@cluster0.ef6pwur.mongodb.net/", {
        dbName: "shopping",
    })
        .then((c) => console.log("connected to database", c.connection.host))
        .catch((e) => console.log(e));
};
