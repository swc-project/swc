class T {
    private throws: number[] = [];
    m(): void {
        console.log(this.throws.length);
    }
}

new T().m();