let id = 0;

export function getId() {
    id = id % 9999;
    return `${id++}`
}