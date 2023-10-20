import express, { Router }  from "express";
import UserManager from "../controllers/UserManager"

const userRouter = Router ()
const user = new UserManager()

userRouter.post("/registre",(req, res) => {
    try
    {

    }
})