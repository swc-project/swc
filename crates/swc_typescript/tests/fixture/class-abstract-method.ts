export abstract class Manager {
    protected abstract A(): void;
    protected B(): void {
        console.log("B");
    }
    protected C(): void {
        console.log("B");
    }
}
