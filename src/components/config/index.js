'use strict'
import dotenv from 'dotenv';
dotenv.config()
import{ Sequelize, Op,QueryTypes } from 'sequelize';

class APP {
    constructor(){
    }

    static Op = Op;
    static QueryTypes=QueryTypes;
    static Datatypes(){
        return Sequelize;
    }
    static sequelize(){
        return  new Sequelize(
            process.env.DB,
            process.env.DB_USER,
            process.env.PASSWORD,
            {
            host: process.env.HOST,
            dialect: process.env.DB_TYPE,
            operatorsAliases: 0,            
            pool: {
                 max: 5,
                 min: 0,
                 acquire: 100000,
                 idle: 10000
            },
            logQueryParameters: false,
            logging: false
            }
        );
    }
    static secretKey(){
        return process.env.SECRET_KEY
    }
    
}

export default APP