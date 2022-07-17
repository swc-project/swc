export function f0() {
    return Array.from(arguments, arguments => arguments + 1, (arguments, b) => arguments + b);
}