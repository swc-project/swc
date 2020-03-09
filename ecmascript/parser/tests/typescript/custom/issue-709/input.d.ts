declare namespace __event {
    export class EventInit {
        constructor({
                        bubbles,
                        cancelable,
                        composed
                    }?: {
            bubbles?: boolean | undefined;
            cancelable?: boolean | undefined;
            composed?: boolean | undefined;
        });
    }
}