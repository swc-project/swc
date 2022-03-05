// @declaration: true
// @filename: file.ts
// @ts-nocheck
export const a = 1 + {}; // This is an error, ofc, `Operator '+' cannot be applied to types '1' and '{}'`, which will be suppressed by the `nocheck` comment
export class Bet {
    constructor(){
        this.q = "lol" // And so will this implements error
        ;
    }
}
