'use strict'
import dotenv from 'dotenv';
dotenv.config()
import express from "express";
const router = express.Router()
import authController from "./authController.js"
import authenticate from './authenticate.js';

const authRoute = async (app) => {
    
    app.get(`/login`, authController.getLogin);
    app.post(`/login`, authController.signIn);
    app.get('/dashboard', authenticate,authController.getDashboard);
    app.get(`/logout`, authController.logout);
  };
export default authRoute