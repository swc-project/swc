function dec(target: any, key: string, descriptor: PropertyDescriptor) {}

export class Channel {
    @dec
    send(
        msg: import("./Message").Message,
        module: import("./Message"),
        union: import("./Message").Message | number
    ): import("./Result").Result {}
}
