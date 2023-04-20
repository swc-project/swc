function decorator(): PropertyDecorator {
    return ()=>null;
}
class Example {
    value?: `prefix${string}`;
}
_ts_decorate([
    decorator(),
    _ts_metadata("design:type", String)
], Example.prototype, "value", void 0);
