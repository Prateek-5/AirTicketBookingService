const {StatusCodes, StatusCodes}=require('http-status-codes')

class ServiceError extends Error{
    constructor(
        message='Something went Wrong',
        explinations='Service layer error',
        statusCodes=StatusCodes.INTERNAL_SERVER_ERROR
        ){
            this.name='ServiceError',
            this.message=message,
            this.explinations=explinations;
            this.StatusCodes=statusCodes;

    }


}

module.exports=ServiceError;