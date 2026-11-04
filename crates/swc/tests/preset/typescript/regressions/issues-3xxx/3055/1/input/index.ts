export class Node {
    childNodes: Node[] = [];
    parent?: Node;

    link(): void {
        this.#link(this);
    }

    #link(parent: Node): void {
        this.parent = parent;

        for (const childNode of this.childNodes) {
            childNode.#link(this);
        }
    }
}
