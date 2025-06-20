import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  addOrUpdateAddress, // Add this import
  deleteAddress,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.get('/profile', authUser, getUserProfile);
userRouter.put('/profile', authUser, updateUserProfile);
// Add this new route for handling addresses
userRouter.post('/address', authUser, addOrUpdateAddress);
userRouter.delete('/address', authUser, deleteAddress);

export default userRouter;