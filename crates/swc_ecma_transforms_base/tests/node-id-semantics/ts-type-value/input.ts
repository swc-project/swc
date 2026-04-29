type Box<T> = T;
const Box = 1;
let value: Box<number> = Box;
interface Shape {
    value: Box<string>;
}
