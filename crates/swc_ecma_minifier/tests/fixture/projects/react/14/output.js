function validatePropTypes(element) {
    var propTypes, type = element.type;
    if (null != type && "string" != typeof type) {
        if ("function" == typeof type) propTypes = type.propTypes;
        else {
            if ("object" != typeof type || type.$$typeof !== REACT_FORWARD_REF_TYPE && // Note: Memo only checks outer props here.
            // Inner props are checked in the reconciler.
            type.$$typeof !== REACT_MEMO_TYPE) return;
            propTypes = type.propTypes;
        }
        if (propTypes) {
            // Intentionally inside to avoid triggering lazy initializers:
            var name = getComponentName(type);
            !function(typeSpecs, values, location, componentName, element) {
                // $FlowFixMe This is okay but Flow doesn't know it.
                var has = Function.call.bind(Object.prototype.hasOwnProperty);
                for(var typeSpecName in typeSpecs)if (has(typeSpecs, typeSpecName)) {
                    var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
                    // fail the render phase where it didn't fail before. So we log it.
                    // After these have been cleaned up, we'll let them throw.
                    try {
                        // This is intentionally an invariant that gets caught. It's the same
                        // behavior as without this statement except with a better message.
                        if ("function" != typeof typeSpecs[typeSpecName]) {
                            var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                            throw err.name = "Invariant Violation", err;
                        }
                        error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
                    } catch (ex) {
                        error$1 = ex;
                    }
                    !error$1 || error$1 instanceof Error || (setCurrentlyValidatingElement(element), error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (// Only monitor this failure once because there tends to be a lot of the
                    // same error.
                    loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error("Failed %s type: %s", location, error$1.message), setCurrentlyValidatingElement(null));
                }
            }(propTypes, element.props, "prop", name, element);
        } else void 0 === type.PropTypes || propTypesMisspellWarningShown || (propTypesMisspellWarningShown = !0, error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", getComponentName(type) || "Unknown"));
        "function" != typeof type.getDefaultProps || type.getDefaultProps.isReactClassApproved || error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
    }
}
