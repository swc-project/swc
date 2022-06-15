function a(a) {
    function b(a, b, c, d, e) {
        {
            var f = Function.call.bind(Object.prototype.hasOwnProperty);
            for(var g in a){
                if (f(a, g)) {
                    var h = void 0;
                    try {
                        if (typeof a[g] !== "function") {
                            var i = Error((d || "React class") + ": " + c + " type `" + g + "` is invalid; " + "it must be a function, usually from the `prop-types` package, but received `" + typeof a[g] + "`." + "This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                            i.name = "Invariant Violation";
                            throw i;
                        }
                        h = a[g](b, g, d, c, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                    } catch (j) {
                        h = j;
                    }
                    if (h && !(h instanceof Error)) {
                        setCurrentlyValidatingElement(e);
                        error("%s: type specification of %s" + " `%s` is invalid; the type checker " + "function must return `null` or an `Error` but returned a %s. " + "You may have forgotten to pass an argument to the type checker " + "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " + "shape all require an argument).", d || "React class", c, g, typeof h);
                        setCurrentlyValidatingElement(null);
                    }
                    if (h instanceof Error && !(h.message in loggedTypeFailures)) {
                        loggedTypeFailures[h.message] = true;
                        setCurrentlyValidatingElement(e);
                        error("Failed %s type: %s", c, h.message);
                        setCurrentlyValidatingElement(null);
                    }
                }
            }
        }
    }
    {
        var c = a.type;
        if (c === null || c === undefined || typeof c === "string") {
            return;
        }
        var d;
        if (typeof c === "function") {
            d = c.propTypes;
        } else if (typeof c === "object" && (c.$$typeof === REACT_FORWARD_REF_TYPE || c.$$typeof === REACT_MEMO_TYPE)) {
            d = c.propTypes;
        } else {
            return;
        }
        if (d) {
            var e = getComponentName(c);
            b(d, a.props, "prop", e, a);
        } else if (c.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var f = getComponentName(c);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", f || "Unknown");
        }
        if (typeof c.getDefaultProps === "function" && !c.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass " + "definitions. Use a static property named `defaultProps` instead.");
        }
    }
}
