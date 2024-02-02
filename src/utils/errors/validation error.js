const {StatusCodes}=require('http-status-codes');
class ValidationError extends Error{
    constructor( error)
    {
        super();
        let explication=[];
        
        error.errors.forEach(err => {
            explication.push(err.message);
        });
        this.name='ValidationError';
        this.message='Not able to validate the data sent in the response',
        this.explication=explination;
        this.statusCode=StatusCodes.BAD_REQUEST;

    }

}

module.exports=ValidationError;
