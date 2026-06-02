function dec(target: Function) {}

@dec
export class Channel {
    constructor(
        msg: import("./Message").Message,
        module: import("./Message"),
        box: import("./Message").Box<import("./Payload").Payload>
    ) {}
}
