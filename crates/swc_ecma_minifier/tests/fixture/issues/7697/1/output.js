let id = 0;
export function getId() {
    return id %= 9999, `${id++}`;
}
