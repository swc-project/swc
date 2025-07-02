const ErrorResponse = (statusCode, message) => {
    return Response.json({
        message
    }, {
        status: statusCode
    });
}

export const unknownError = ErrorResponse(520, "Unknown error.");