import logger from './logger.js'
import Eventemit from "events";
const myemit = new Eventemit();

export default (app) => {
    app.use((error, req, res, next) => {
        console.log(error)
        next(res.status(error.status || 500 || 400).json(
            {
                status: error.status || 500 ||400,
                message: error.message || 'Internal Server Error',
                data:  error.errorDetail 
            },
        ));
        //// Call Event //////
        myemit.emit('logmessage', JSON.stringify(error.message), error.isOperational)
        return
    });
}

//// Log Error Event //////
myemit.on('logmessage', function(msg, isOperational){
        if(isOperational === true)
            logger.infoLogger.info(msg)
        else
            logger.errorLogger.error(msg)
})   