export function input(name__2) {
    return `${name__2}.md?render`;
}
export default function({ name__3 , input: inp__3 ,  }) {
    inp__3 = inp__3 || input(name__3);
    return {
        input: inp__3
    };
};
;
