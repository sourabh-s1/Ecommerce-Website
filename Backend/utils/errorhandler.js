class ErrorHandler extends Error{
	constructor(message,statusCode){
		super(message);
		this.statusCode = statusCode;


		//to capture error
		Error.captureStackTrace(this,this.constructor)
	}
}

module.exports = ErrorHandler;