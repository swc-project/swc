function e(e) {
    function t(e, t, s, o, n) {
        {
            var a = Function.call.bind(Object.prototype.hasOwnProperty);
            for(var r in e){
                if (a(e, r)) {
                    var p = void 0;
                    try {
                        if (typeof e[r] !== "function") {
                            var i = Error((o || "React class") + ": " + s + " type `" + r + "` is invalid; " + "it must be a function, usually from the `prop-types` package, but received `" + typeof e[r] + "`." + "This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                            i.name = "Invariant Violation";
                            throw i;
                        }
                        p = e[r](t, r, o, s, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                    } catch (f) {
                        p = f;
                    }
                    if (p && !(p instanceof Error)) {
                        setCurrentlyValidatingElement(n);
                        error("%s: type specification of %s" + " `%s` is invalid; the type checker " + "function must return `null` or an `Error` but returned a %s. " + "You may have forgotten to pass an argument to the type checker " + "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " + "shape all require an argument).", o || "React class", s, r, typeof p);
                        setCurrentlyValidatingElement(null);
                    }
                    if (p instanceof Error && !(p.message in loggedTypeFailures)) {
                        loggedTypeFailures[p.message] = true;
                        setCurrentlyValidatingElement(n);
                        error("Failed %s type: %s", s, p.message);
                        setCurrentlyValidatingElement(null);
                    }
                }
            }
        }
    }
    {
        var s = e.type;
        if (s === null || s === undefined || typeof s === "string") {
            return;
        }
        var o;
        if (typeof s === "function") {
            o = s.propTypes;
        } else if (typeof s === "object" && (s.$$typeof === REACT_FORWARD_REF_TYPE || s.$$typeof === REACT_MEMO_TYPE)) {
            o = s.propTypes;
        } else {
            return;
        }
        if (o) {
            var n = getComponentName(s);
            t(o, e.props, "prop", n, e);
        } else if (s.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var a = getComponentName(s);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", a || "Unknown");
        }
        if (typeof s.getDefaultProps === "function" && !s.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass " + "definitions. Use a static property named `defaultProps` instead.");
        }
    }
}
