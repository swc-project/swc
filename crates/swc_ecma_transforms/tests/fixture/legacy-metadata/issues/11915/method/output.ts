function dec(target: any, key: string, descriptor: PropertyDescriptor) {}
export class Channel {
    send(msg: import("./Message").Message, module: import("./Message"), union: import("./Message").Message | number): import("./Result").Result {}
}
_ts_decorate([
    dec,
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object,
        Object,
        Object
    ]),
    _ts_metadata("design:returntype", Object)
], Channel.prototype, "send", null);
