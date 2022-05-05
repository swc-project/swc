function validatePropTypes(element) {
    function checkPropTypes(
        typeSpecs,
        values,
        location,
        componentName,
        element
    ) {
        {
            // $FlowFixMe This is okay but Flow doesn't know it.
            var has = Function.call.bind(Object.prototype.hasOwnProperty);

            for (var typeSpecName in typeSpecs) {
                if (has(typeSpecs, typeSpecName)) {
                    var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
                    // fail the render phase where it didn't fail before. So we log it.
                    // After these have been cleaned up, we'll let them throw.

                    try {
                        // This is intentionally an invariant that gets caught. It's the same
                        // behavior as without this statement except with a better message.
                        if (typeof typeSpecs[typeSpecName] !== "function") {
                            var err = Error(
                                (componentName || "React class") +
                                    ": " +
                                    location +
                                    " type `" +
                                    typeSpecName +
                                    "` is invalid; " +
                                    "it must be a function, usually from the `prop-types` package, but received `" +
                                    typeof typeSpecs[typeSpecName] +
                                    "`." +
                                    "This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
                            );
                            err.name = "Invariant Violation";
                            throw err;
                        }

                        error$1 = typeSpecs[typeSpecName](
                            values,
                            typeSpecName,
                            componentName,
                            location,
                            null,
                            "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"
                        );
                    } catch (ex) {
                        error$1 = ex;
                    }

                    if (error$1 && !(error$1 instanceof Error)) {
                        setCurrentlyValidatingElement(element);

                        error(
                            "%s: type specification of %s" +
                                " `%s` is invalid; the type checker " +
                                "function must return `null` or an `Error` but returned a %s. " +
                                "You may have forgotten to pass an argument to the type checker " +
                                "creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and " +
                                "shape all require an argument).",
                            componentName || "React class",
                            location,
                            typeSpecName,
                            typeof error$1
                        );

                        setCurrentlyValidatingElement(null);
                    }

                    if (
                        error$1 instanceof Error &&
                        !(error$1.message in loggedTypeFailures)
                    ) {
                        // Only monitor this failure once because there tends to be a lot of the
                        // same error.
                        loggedTypeFailures[error$1.message] = true;
                        setCurrentlyValidatingElement(element);

                        error("Failed %s type: %s", location, error$1.message);

                        setCurrentlyValidatingElement(null);
                    }
                }
            }
        }
    }

    {
        var type = element.type;

        if (type === null || type === undefined || typeof type === "string") {
            return;
        }

        var propTypes;

        if (typeof type === "function") {
            propTypes = type.propTypes;
        } else if (
            typeof type === "object" &&
            (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
                // Inner props are checked in the reconciler.
                type.$$typeof === REACT_MEMO_TYPE)
        ) {
            propTypes = type.propTypes;
        } else {
            return;
        }

        if (propTypes) {
            // Intentionally inside to avoid triggering lazy initializers:
            var name = getComponentName(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
        } else if (
            type.PropTypes !== undefined &&
            !propTypesMisspellWarningShown
        ) {
            propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

            var _name = getComponentName(type);

            error(
                "Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",
                _name || "Unknown"
            );
        }

        if (
            typeof type.getDefaultProps === "function" &&
            !type.getDefaultProps.isReactClassApproved
        ) {
            error(
                "getDefaultProps is only used on classic React.createClass " +
                    "definitions. Use a static property named `defaultProps` instead."
            );
        }
    }
}
