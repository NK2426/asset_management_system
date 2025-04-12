class ErrorHandler extends Error{
    constructor(message = '', statusCode = 500, detail = [], isOperational = false){
        super(message)
        this.message = this.isObject(message)
        this.status = statusCode
        this.errorDetail = detail
        this.isOperational = isOperational
        // console.log('message =>',this)
        Error.captureStackTrace(this);
    }
    isObject( val) {
        let obj =  val instanceof Object; 
        if(obj === true){
            val = obj.message || '';
        }
        return val
    }
}

export default ErrorHandler