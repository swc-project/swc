export default class Test {
    #element: HTMLElement;

    constructor(element: HTMLElement) {
        this.#element = element;
    }

    #run() {
        setTimeout(() => {
            this.#element.textContent = "TESTED";
        }, 1000);
    }

    run() {
        this.#run();
    }
}
