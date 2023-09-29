getInitialProps = (code)=>{
    let statusCode, message;
    return code && (statusCode = code), message = 404 === statusCode ? "404" : "500", {
        statusCode,
        message
    };
};
