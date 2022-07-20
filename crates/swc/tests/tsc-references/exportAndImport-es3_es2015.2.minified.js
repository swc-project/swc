export default function f1() {};
import f1 from "./m1";
export default function f2() {
    f1();
};
