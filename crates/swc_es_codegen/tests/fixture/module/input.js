import a, { b as c, "d-e" as de } from "m1" with { type: "json" };
import * as ns from "m2";
import "m3";
export { a, c as cc, "d-e" as de } from "m1" with { type: "json" };
export * as all from "m2";
export default class Defaulted extends Base {}
export const value = 1;
