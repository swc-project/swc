function dec(target: any, key: string) {}

export class Channel {
    @dec
    msg!: import("./Message").Message;

    @dec
    module!: import("./Message");

    @dec
    parenthesized!: (import("./Message").Message);

    @dec
    generic!: import("./Message").Box<import("./Payload").Payload>;

    @dec
    union!: import("./Message").Message | string;

    @dec
    intersection!: import("./Message").Message & { id: string };
}
