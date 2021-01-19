function callValidate() {
    var validate = compilation.validate;
    var result = validate.apply(null, arguments);
    return (callValidate.errors = validate.errors), result;
}
