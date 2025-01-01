import { sendWelcomeEmail, sendPasswordResetEmail } from "../helpers/email.js";
import validator from "email-validator";
import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export const api = async (req, res) => {
  res.send(`The current time is ${new Date().toLocaleDateString()}`);
};

export const login = async (req, res) => {
  //Get the email and password from the request body
  const { email, password } = req.body;
  //Email and Password validation
  if (!validator.validate(email)) {
    return res.json({
      error: "Please enter a valid email address",
    });
  }
  if (!email?.trim()) {
    return res.json({
      error: "Email is required",
    });
  }
  if (!password?.trim()) {
    return res.json({
      error: "Password is required",
    });
  }
  if (password?.length < 6) {
    return res.json({
      error: "Password must be at least 6 characters long",
    });
  }
  if (password?.length > 14) {
    return res.json({
      error: "Password must be maximum 14 characters long",
    });
  }
  //Check if the user already exists
  try {
    const user = await User.findOne({ email });
    //If user does not exist, send a mail and confirm if it is valid
    if (!user) {
      try {
        await sendWelcomeEmail(email);
      } catch (err) {
        return res.json({
          error: "Error sending email",
        });
      }
      //Create a new user
      const createdUser = await User.create({
        email,
        password: await hashPassword(password),
        userName: nanoid(6), // A default random ID for the user that can be changed later
      });
      //Create a JWT
      const token = jwt.sign({ _id: createdUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      createdUser.password = undefined; // Setting the password to undefined before sending it back as a json response
      return res.json({
        token,
        user: createdUser,
      });
    } else {
      const match = await comparePassword(password, user.password);
      console.log(match);
      if (!match) {
        return res.json({
          error: "Incorrect password, Please try again",
        });
      }
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      user.password = undefined;

      return res.json({
        token,
        user,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      error: "Login error, please try again",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    //Get the email from the request body
    const { email } = req.body;
    let user = await User.findOne({ email });
    //If user does not exist
    if (!user) {
      res.json({
        error:
          "If you are a existing user, you will receive a password reset email",
      });
    } else {
      //Generate a new code that can be sent to the user's email id
      const password = nanoid(6);
      user.password = await hashPassword(password);
      user.save();
      //send a email with the updated password
      try {
        //send email
        await sendPasswordResetEmail(email, password);
        return res.json({
          message: "Password reset email has been sent",
        });
      } catch (err) {
        res.json({
          error: "Error sending a email",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.json({
      error: "Error in password reset, please try again later",
    });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.password = undefined;
    res.json(user);
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

export const updatePassword = async (req, res) => {
  let { password } = req.body;

  password = password ? password.trim() : "";
  if (!password) {
    return res.json({
      err: "Password is required",
    });
  }
  if (password?.length < 6) {
    return res.json({
      error: "Password must be at least 6 characters long",
    });
  }
  if (password?.length > 14) {
    return res.json({
      error: "Password must be maximum 14 characters long",
    });
  }
  try {
    const user = await User.findById(req.user._id);
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.save();
    return res.json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.log(err);
    return res.json({ err });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.json({
        err: "Username is required",
      });
    }
    const trimmedUsername = username.trim();
    const existingUserName = await User.findOne({ userName: trimmedUsername });
    if (existingUserName) {
      return res.json({
        err: "Username already exists, please try a different username",
      });
    }
    await User.findByIdAndUpdate(
      req.user._id,
      { userName: trimmedUsername },
      { new: true }
    );

    return res.json({
      message: "Username updated successfully",
    });
  } catch (err) {
    console.log(err);
    res.json({
      err: "Error while updating username. Please try again",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, company, address, about, photo, logo } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name.trim();
    if (phone) updateFields.phone = phone.trim();
    if (company) updateFields.company = company.trim();
    if (address) updateFields.address = address.trim();
    if (about) updateFields.about = about.trim();
    if (photo) updateFields.photo = photo;
    if (logo) updateFields.logo = logo;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.json({
        error: "User not found",
      });
    }

    updatedUser.password = undefined;

    res.json(updatedUser);
  } catch (err) {
    console.log("Update profile error", err);
    res.json({
      error: "Something went wrong. Try again",
    });
  }
};
