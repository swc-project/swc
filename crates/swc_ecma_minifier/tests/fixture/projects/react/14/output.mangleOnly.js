function a(c) {
    function d(c, h, d, e, f) {
        {
            var i = Function.call.bind(Object.prototype.hasOwnProperty);
            for(var b in c){
                if (i(c, b)) {
                    var a = void 0;
                    try {
                        if (typeof c[b] !== "function") {
                            var g = Error((e || "React class") + ": " + d + " type `" + b + "` is invalid; " + "it must be a function, usually from the `prop-types` package, but received `" + typeof c[b] + "`." + "This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                            g.name = "Invariant Violation";
                            throw g;
                        }
                        a = c[b](h, b, e, d, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                    } catch (j) {
                        a = j;
                    }
                    if (a && !(a instanceof Error)) {
                        setCurrentlyValidatingElement(f);
                        error("%s: type specification of %s" + " `%s` is invalid; the type checker " + "function must return `null` or an `Error` but returned a %s. " + "You may have forgotten to pass an argument to the type checker " + "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " + "shape all require an argument).", e || "React class", d, b, typeof a);
                        setCurrentlyValidatingElement(null);
                    }
                    if (a instanceof Error && !(a.message in loggedTypeFailures)) {
                        loggedTypeFailures[a.message] = true;
                        setCurrentlyValidatingElement(f);
                        error("Failed %s type: %s", d, a.message);
                        setCurrentlyValidatingElement(null);
                    }
                }
            }
        }
    }
    {
        var a = c.type;
        if (a === null || a === undefined || typeof a === "string") {
            return;
        }
        var b;
        if (typeof a === "function") {
            b = a.propTypes;
        } else if (typeof a === "object" && (a.$$typeof === REACT_FORWARD_REF_TYPE || a.$$typeof === REACT_MEMO_TYPE)) {
            b = a.propTypes;
        } else {
            return;
        }
        if (b) {
            var e = getComponentName(a);
            d(b, c.props, "prop", e, c);
        } else if (a.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var f = getComponentName(a);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", f || "Unknown");
        }
        if (typeof a.getDefaultProps === "function" && !a.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass " + "definitions. Use a static property named `defaultProps` instead.");
        }
    }
}
