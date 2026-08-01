class Base {
    setState(value) {
        return value;
    }
}

class Derived extends Base {
    state = { value: 1 };

    method = async (param) => {
        const { state = this.state } = param;
        return this.setState(state);
    };
}
