import { F, swap } from "./constructors";

export const value = swap() ? new F(1) : new F(2);
