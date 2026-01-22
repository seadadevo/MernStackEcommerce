export const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name; 
        error.code = err.code; 

        if (error.name === 'CastError') error = handleCastError(error);

        if (error.code === 11000) error = handleDuplicateFields(error);

        if (error.name === 'ValidationError') error = handleValidationError(error);

        sendErrorProd(error, res);
    }
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
        stack: err.stack,
        error: err
    });
};

const sendErrorProd = (err, res) => {
    // Operational errors
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    } else {
        // Programming errors
        console.error('ERROR :', err);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};


export const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return createError(message, 400);
};

export const handleDuplicateFields = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for field: ${field}`;
    return createError(message, 400);
};

export const handleValidationError = (err) => {
    const messages = Object.values(err.errors).map(e => e.message);
    const message = messages.join('. ');
    return createError(message, 400);
};

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.status = 'fail';
    error.isOperational = true;
    return error;
};
