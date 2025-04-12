'use strict'
import jwt from "jsonwebtoken"
import APP from '../config/index.js'
import ErrorHandler from "../utils/errorHandler.js"

const authenticate = async (req, res, next) => {
    const token = req.cookies.token;
    if (token == null) {
        return next(new ErrorHandler('No Token Provided', 401));
    } else {
        await jwt.verify(token, APP.secretKey(), (err, user) => {
           
            if (err || !user ) {
                return next(new ErrorHandler('Unauthorized User', 401));
            }
            req.user = user;
            next()
        });
    }

}
export default authenticate;