export function input(name) {
    return `${name}.md?render`;
}

export default function ({ name, input: inp }) {
    inp = inp || input(name);
    return { input: inp };
}
