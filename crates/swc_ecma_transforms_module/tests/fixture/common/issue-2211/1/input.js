import { bar } from "./bar";

const makeX = () => {
    const _bar = () => bar();
    return { _bar };
};

makeX()._bar();
