jQuery.ajaxSettings.xhr = window.ActiveXObject
    ? function (
    ) {
        return (
            (!this.isLocal && createStandardXHR(
            )) ||
            (function (
            ) {
                try {
                    return new window.ActiveXObject(
                        "Microsoft.XMLHTTP"
                    );
                } catch (e) { }
            })(
            )
        );
    }
    : createStandardXHR