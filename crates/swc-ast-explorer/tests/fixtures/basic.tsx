type Message = {
    value: string;
};

const message: Message = {
    value: "hello",
};

export const view = <span>{message.value}</span>;
