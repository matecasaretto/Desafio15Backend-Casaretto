export class CustomError {
    static createError({ name = "Error", cause, message, errorCode }) {
        const error = new Error(message);
        error.name = name;
        error.cause = cause;
        error.code = errorCode;
        throw error;
    }
}
