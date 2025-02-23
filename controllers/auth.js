const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  //create user; communicate with DB
  const user = await User.create({ ...req.body });
  //create token
  const token = user.createJWT();
  //respond to user
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "user created", token, user: { name: user.name } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  //check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Email does not exist in our database");
  }
  //check password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, user: { name: user.name } });
};

module.exports = {
  register,
  login,
};
