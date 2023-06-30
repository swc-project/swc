export function input__2(name__3) {
    return `${name__3}.md?render`;
}
export default function({ name__4, input: inp__4 }) {
    inp__4 = inp__4 || input__2(name__4);
    return {
        input: inp__4
    };
}
