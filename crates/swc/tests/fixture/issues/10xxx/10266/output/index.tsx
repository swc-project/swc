"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DealRentModalWithFormik", {
    enumerable: true,
    get: function() {
        return DealRentModalWithFormik;
    }
});
var _formik = require("formik");
var _yup = require("yup");
var test = {
    validationSchema: (0, _yup.object)({
        isAgent: (0, _yup.boolean)().required()
    }),
    handleSubmit: function handleSubmit() {}
};
console.log(test);
var DealRentModalWithFormik = (0, _formik.withFormik)({
    validationSchema: (0, _yup.object)({
        isAgent: (0, _yup.boolean)().required()
    }),
    handleSubmit: function handleSubmit() {}
})(function() {
    return React.createElement("span", null);
});
