function decorator(): PropertyDecorator {
    return ()=>null;
}
class Example {
    value?: `prefix${string}`;
}
__decorate([
    decorator(),
    __metadata("design:type", String)
], Example.prototype, "value", void 0);
