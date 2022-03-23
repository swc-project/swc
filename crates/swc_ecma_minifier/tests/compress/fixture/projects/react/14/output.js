function validatePropTypes(element1) {
    var propTypes, type = element1.type;
    if (null != type && 'string' != typeof type) {
        if ('function' == typeof type) propTypes = type.propTypes;
        else {
            if ('object' != typeof type || type.$$typeof !== REACT_FORWARD_REF_TYPE && type.$$typeof !== REACT_MEMO_TYPE) return;
            propTypes = type.propTypes;
        }
        if (propTypes) {
            var name = getComponentName(type);
            !function(typeSpecs, values, location, componentName, element) {
                var has = Function.call.bind(Object.prototype.hasOwnProperty);
                for(var typeSpecName in typeSpecs)if (has(typeSpecs, typeSpecName)) {
                    var error$1 = void 0;
                    try {
                        if ('function' != typeof typeSpecs[typeSpecName]) {
                            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                            throw err.name = 'Invariant Violation', err;
                        }
                        error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
                    } catch (ex) {
                        error$1 = ex;
                    }
                    !error$1 || error$1 instanceof Error || (setCurrentlyValidatingElement(element), error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || 'React class', location, typeSpecName, typeof error$1), setCurrentlyValidatingElement(null)), error$1 instanceof Error && !(error$1.message in loggedTypeFailures) && (loggedTypeFailures[error$1.message] = !0, setCurrentlyValidatingElement(element), error('Failed %s type: %s', location, error$1.message), setCurrentlyValidatingElement(null));
                }
            }(propTypes, element1.props, 'prop', name, element1);
        } else void 0 === type.PropTypes || propTypesMisspellWarningShown || (propTypesMisspellWarningShown = !0, error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', getComponentName(type) || 'Unknown'));
        'function' != typeof type.getDefaultProps || type.getDefaultProps.isReactClassApproved || error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
    }
}
