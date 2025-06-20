import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const CreateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Route for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = CreateToken(user._id);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for user registration
const registerUser = async (req, res) => {
  try {
    const { name, surname, email, password, phoneNo, identityNo, gender } =
      req.body;

    // Check if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      surname,
      email,
      password: hashedPassword,
      phoneNo,
      identityNo,
      gender,
    });

    // Save the new user to the database
    const user = await newUser.save();

    // Create a token for the new user
    const token = CreateToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for adding or updating user addresses
const addOrUpdateAddress = async (req, res) => {
  try {
    const { userId, label, street, city, state, postalCode, country } =
      req.body;

    // Validate required fields
    if (!label || !street || !city || !state || !postalCode || !country) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Update or add the address
    const existingAddressIndex = user.addresses.findIndex(
      (addr) => addr.label === label
    );

    if (existingAddressIndex >= 0) {
      // Update existing address
      user.addresses[existingAddressIndex] = {
        label,
        street,
        city,
        state,
        postalCode,
        country,
      };
    } else {
      // Add new address
      user.addresses.push({ label, street, city, state, postalCode, country });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address added/updated successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { userId, label } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Remove the address with matching label
    user.addresses = user.addresses.filter((addr) => addr.label !== label);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = CreateToken(email + password);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Route for fetching user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.body; // Auth middleware'den gelen kullanıcı ID'si
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNo: user.phoneNo,
        identityNo: user.identityNo,
        gender: user.gender,
        addresses: user.addresses, // Adres bilgilerini ekledik
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Route for updating user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, surname, email, phoneNo, identityNo, gender } =
      req.body;

    // Check for missing fields
    if (!name || !surname || !email || !phoneNo || !identityNo || !gender) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { name, surname, email, phoneNo, identityNo, gender },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        name: updatedUser.name,
        surname: updatedUser.surname,
        email: updatedUser.email,
        phoneNo: updatedUser.phoneNo,
        identityNo: updatedUser.identityNo,
        gender: updatedUser.gender,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export {
  loginUser,
  registerUser,
  addOrUpdateAddress,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  deleteAddress,
};
