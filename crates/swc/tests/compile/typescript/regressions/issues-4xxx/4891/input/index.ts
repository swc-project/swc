export class LocalStorageChannel {
    readonly #channelName: string;
    #listeners: MessageListener[];

    constructor(channelName: string) {
        this.#channelName = channelName;
        this.#listeners = [];
        window.addEventListener("storage", (event) =>
            this.onStorageEvent(event)
        );
    }
}
