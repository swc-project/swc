bad = function (e) {
    return function (error) {
        try {
            e();
        } catch (e) {
            error(e);
        }
    };
};
