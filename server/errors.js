
class ExpressError extends Error {
    constructor(status, statusMessage){
        super(statusMessage);
        this.status = status;
    }
}
class InvalidParameter extends ExpressError {
    constructor(statusMessage){
        super(400, statusMessage);
    }
};

class AlreadyExists extends ExpressError {
    constructor(statusMessage){
        super(409, statusMessage);
    }
};

class NotFound extends ExpressError {
    constructor(statusMessage){
        super(404, statusMessage);
    }
};

module.exports = {
    InvalidParameter: InvalidParameter,
    AlreadyExists: AlreadyExists,
    NotFound: NotFound
}
