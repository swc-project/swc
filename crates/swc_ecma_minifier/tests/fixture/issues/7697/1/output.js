let id = 0;
function getId() {
    return id %= 9999, `${id++}`;
}
export { getId };
