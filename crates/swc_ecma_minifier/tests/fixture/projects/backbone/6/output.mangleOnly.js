function a() {
    return !error ? !0 : (this.trigger("invalid", this, error, _.extend(options, {
        validationError: error
    })), !1);
}
