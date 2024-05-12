import bigPromise from "../middleware/bigPromise.js";
import User from "../models/User.model.js";



export const createUser = bigPromise(async (req, res, next) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(501).json({
      success: true,
      message: "User Already Exists !",
    });
  } else {
    const user = await User.create({
      email,
      password,
      username,
    });

    return res.status(201).json({
      success: true,
      message: "User Created Successfully !",
      data: user,
    });
  }
});

export const loginUser = bigPromise(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isValidPassword = await user.isValidatedPassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = user.getJwtToken();
    res.status(200).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});