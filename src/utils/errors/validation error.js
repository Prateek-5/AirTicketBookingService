const {statusCode, StatusCodes}=require('http-status-codes');
class ValidationError extends Error{
    constructor( error)
    {
        super();
        let explication=[];
        error.error.forEach(element => {
            explication.push(error.message);
        });
        this.name='ValidationError';
        this.message='Not able to validate the data sent in the response',
        this.explication=explination;
        this.statusCode=StatusCodes.BAD_REQUEST;

    }

}

module.exports=ValidationError;
