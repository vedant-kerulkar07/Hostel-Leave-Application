// routes/User.route.js
import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { getUser, updateUser, getMe, completeProfile } from "../controllers/User.controller.js";

const UserRoute = express.Router();

UserRoute.get("/get-user/:userid", authenticate, getUser);
UserRoute.put("/update-user/:userid", authenticate, updateUser);
UserRoute.get("/me", authenticate, getMe); // current logged-in user
UserRoute.post("/complete-profile", authenticate, completeProfile); //  popup profile update

export default UserRoute;
