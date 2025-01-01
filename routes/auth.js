import express from "express";
import * as auth from "../controllers/auth.js";
import { requireSignIn } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", requireSignIn, auth.api);
router.post("/login", auth.login);
router.post("/forgot-password", auth.forgotPassword);
router.get("/current-user", requireSignIn, auth.currentUser);
router.put("/update-password", requireSignIn, auth.updatePassword);
router.put("/update-username", requireSignIn, auth.updateUsername);
router.put("/update-profile", requireSignIn, auth.updateProfile);

export default router;
