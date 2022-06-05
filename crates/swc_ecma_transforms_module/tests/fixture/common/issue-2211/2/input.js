import { bar } from "./bar";

const makeX = () => {
    const _bar = () => bar();

    const alfa = () => _bar();

    return { alfa };
};
