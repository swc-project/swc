function e(e) {
    function t(e, t, p, r, f) {
        {
            var o = Function.call.bind(Object.prototype.hasOwnProperty);
            for(var a in e){
                if (o(e, a)) {
                    var s = void 0;
                    try {
                        if (typeof e[a] !== "function") {
                            var i = Error((r || "React class") + ": " + p + " type `" + a + "` is invalid; " + "it must be a function, usually from the `prop-types` package, but received `" + typeof e[a] + "`." + "This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                            i.name = "Invariant Violation";
                            throw i;
                        }
                        s = e[a](t, a, r, p, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                    } catch (n) {
                        s = n;
                    }
                    if (s && !(s instanceof Error)) {
                        setCurrentlyValidatingElement(f);
                        error("%s: type specification of %s" + " `%s` is invalid; the type checker " + "function must return `null` or an `Error` but returned a %s. " + "You may have forgotten to pass an argument to the type checker " + "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " + "shape all require an argument).", r || "React class", p, a, typeof s);
                        setCurrentlyValidatingElement(null);
                    }
                    if (s instanceof Error && !(s.message in loggedTypeFailures)) {
                        loggedTypeFailures[s.message] = true;
                        setCurrentlyValidatingElement(f);
                        error("Failed %s type: %s", p, s.message);
                        setCurrentlyValidatingElement(null);
                    }
                }
            }
        }
    }
    {
        var p = e.type;
        if (p === null || p === undefined || typeof p === "string") {
            return;
        }
        var r;
        if (typeof p === "function") {
            r = p.propTypes;
        } else if (typeof p === "object" && (p.$$typeof === REACT_FORWARD_REF_TYPE || p.$$typeof === REACT_MEMO_TYPE)) {
            r = p.propTypes;
        } else {
            return;
        }
        if (r) {
            var f = getComponentName(p);
            t(r, e.props, "prop", f, e);
        } else if (p.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var o = getComponentName(p);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", o || "Unknown");
        }
        if (typeof p.getDefaultProps === "function" && !p.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass " + "definitions. Use a static property named `defaultProps` instead.");
        }
    }
}
