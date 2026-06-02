function dec(target: any, key: string) {}
export class Channel {
    msg!: import("./Message").Message;
    module!: import("./Message");
    parenthesized!: (import("./Message").Message);
    generic!: import("./Message").Box<import("./Payload").Payload>;
    union!: import("./Message").Message | string;
    intersection!: import("./Message").Message & {
        id: string;
    };
}
_ts_decorate([
    dec,
    _ts_metadata("design:type", Object)
], Channel.prototype, "msg", void 0);
_ts_decorate([
    dec,
    _ts_metadata("design:type", Object)
], Channel.prototype, "module", void 0);
_ts_decorate([
    dec,
    _ts_metadata("design:type", Object)
], Channel.prototype, "parenthesized", void 0);
_ts_decorate([
    dec,
    _ts_metadata("design:type", Object)
], Channel.prototype, "generic", void 0);
_ts_decorate([
    dec,
    _ts_metadata("design:type", Object)
], Channel.prototype, "union", void 0);
_ts_decorate([
    dec,
    _ts_metadata("design:type", Object)
], Channel.prototype, "intersection", void 0);
