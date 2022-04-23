class C1 {
    constructor() {
        new.target;
    }
}

class C2 {
    constructor() {
        const a = () => {
            new.target;
        };
    }
}
