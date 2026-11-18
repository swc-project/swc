export class Test {
    public async bad(): Promise<void> {
        let foo = false;

        [foo] = await Promise.all(
            [
                this.foo(),
            ]
        );
    }

    public async good(): Promise<void> {
        let [foo] = await Promise.all(
            [
                this.foo(),
            ]);
    }

    private async foo(): Promise<boolean> {
        return true;
    }
}