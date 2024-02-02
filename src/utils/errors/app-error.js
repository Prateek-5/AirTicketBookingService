class AppError extends Error{
    constructor(
        name,
        message,
        explication,
        statusCode
    ){
        super();
        this.name=name;
        this.message=message;
        this.explication=explication;
        this.statusCode=statusCode;
    }
}

module.exports=AppError;
