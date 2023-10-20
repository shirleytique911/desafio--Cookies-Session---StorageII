import mongose from "mongoose"


const usersCollection ="users";

const usersShema =new mongose.Schema({
    first_name : String,
    last_name : String,
    age: Number,
    password: String,
    rol:String
})

exports const usersModel = mongose.model(usersCollection)