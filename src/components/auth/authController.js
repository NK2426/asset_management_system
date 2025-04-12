import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import APP from "../config/index.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/userModel.js";
const Op = APP.Op;

const signIn = async (req, res, next) => {
  try {
    await User.findOne({
      where: { email: req.body.email, status: 1 },
    })
      .then((user) => {
        if (!user) {
          return next(new ErrorHandler("User not found", 404));
        }
        let passwordvalid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordvalid) {
          return next(new ErrorHandler("Password not valid", 404));
        }
        let token = jwt.sign(
          {
            id: user.uid,
            role: user.roleID,
            name: user.name,

          },
          APP.secretKey(),
          { expiresIn: 21600 }
        );

        res.cookie('token', token, { httpOnly: true });
        res.render('dashboard', {
          user: user.username || 'User',
          token: token || 'No token found',
          email: user.email || 'No email found'
        });
      })
      .catch((err) => {
        console.log(err);

        next(new ErrorHandler(err, 500));
      });
  } catch (err) {
    next(new ErrorHandler(err, 500));
  }
};
const getLogin = (req, res) => {
  res.render('login', { error: null });
};

const getDashboard = (req, res) => {
  res.render('dashboard', { user: req.user.uid });
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
export default {
  signIn,
  logout,
  getLogin,
  getDashboard
};
