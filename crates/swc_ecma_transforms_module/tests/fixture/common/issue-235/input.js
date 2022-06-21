import { Foo as Bar } from "something";
export const fn = ({ a = new Bar() }) => a;
