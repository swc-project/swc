import { bar } from "./Bar";

const makeX = (props) => {
    const _bar = props.bar;
    const { list } = _bar;

    return list.map(() => bar);
};
