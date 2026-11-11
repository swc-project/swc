export const {foo} = obj;
export {foo as bar};
export const [, baz] = arr;
export const {key: renamed} = obj;
export {key} from "m";
export const {d = initRef} = obj;
export {initRef} from "m";
export const {[computed]: c} = obj;
export {computed} from "m";
