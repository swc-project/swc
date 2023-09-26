getInitialProps = (code) => {
    let statusCode, message;

    if (code) {
        statusCode = code;
    }

    switch (statusCode) {
        case 404:
            message = "404";
            break;
        default:
            message = "500";
    }

    return { statusCode, message };
};
