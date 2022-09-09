function e(e) {
    function t(e, t, r, n, o) {
        {
            var s = Function.call.bind(Object.prototype.hasOwnProperty);
            for(var a in e){
                if (s(e, a)) {
                    var p = void 0;
                    try {
                        if (typeof e[a] !== "function") {
                            var i = Error((n || "React class") + ": " + r + " type `" + a + "` is invalid; " + "it must be a function, usually from the `prop-types` package, but received `" + typeof e[a] + "`." + "This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                            i.name = "Invariant Violation";
                            throw i;
                        }
                        p = e[a](t, a, n, r, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                    } catch (l) {
                        p = l;
                    }
                    if (p && !(p instanceof Error)) {
                        setCurrentlyValidatingElement(o);
                        error("%s: type specification of %s" + " `%s` is invalid; the type checker " + "function must return `null` or an `Error` but returned a %s. " + "You may have forgotten to pass an argument to the type checker " + "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " + "shape all require an argument).", n || "React class", r, a, typeof p);
                        setCurrentlyValidatingElement(null);
                    }
                    if (p instanceof Error && !(p.message in loggedTypeFailures)) {
                        loggedTypeFailures[p.message] = true;
                        setCurrentlyValidatingElement(o);
                        error("Failed %s type: %s", r, p.message);
                        setCurrentlyValidatingElement(null);
                    }
                }
            }
        }
    }
    {
        var r = e.type;
        if (r === null || r === undefined || typeof r === "string") {
            return;
        }
        var n;
        if (typeof r === "function") {
            n = r.propTypes;
        } else if (typeof r === "object" && (r.$$typeof === REACT_FORWARD_REF_TYPE || r.$$typeof === REACT_MEMO_TYPE)) {
            n = r.propTypes;
        } else {
            return;
        }
        if (n) {
            var o = getComponentName(r);
            t(n, e.props, "prop", o, e);
        } else if (r.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var s = getComponentName(r);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", s || "Unknown");
        }
        if (typeof r.getDefaultProps === "function" && !r.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass " + "definitions. Use a static property named `defaultProps` instead.");
        }
    }
}
