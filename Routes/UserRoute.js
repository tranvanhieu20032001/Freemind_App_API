import express from "express";
import {
  addFriend,
  deleteUser,
  getUser,
  unFriend,
  updateUser,
} from "../Controllers/UserController.js";

const router = express.Router();

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/:id/addfriend", addFriend);
router.put("/:id/unfriend", unFriend);

export default router;
