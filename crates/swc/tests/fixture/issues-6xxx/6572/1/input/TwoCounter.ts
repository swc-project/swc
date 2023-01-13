import { action, observable } from "mobx";

class Counter {
    @observable state = 0;
    @action add() {
        throw new Error("Not implemented");
    }
    @action.bound sub() {
        throw new Error("Not implemented");
    }
}

export class TwoCounter extends Counter {
    @action add() {
        this.state += 2;
    }
    @action.bound sub() {
        this.state -= 2;
    }
}