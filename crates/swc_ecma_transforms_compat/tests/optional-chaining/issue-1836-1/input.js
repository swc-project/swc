function bug() {
    const arrowFn = (arg) => this.object[arg]?.();
}

bug();