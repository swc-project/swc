import { Service } from "./service";
import { Decorate } from "./Decorate";

const sym = Symbol();

@Decorate()
class Sample {
    constructor(
        private p0: String,
        p1: Number,
        p2: 10,
        p3: "ABC",
        p4: boolean,
        p5: string,
        p6: number,
        p7: Object,
        p8: () => any,
        p9: "abc" | "def",
        p10: String | Number,
        p11: Function,
        p12: null,
        p13: undefined,
        p14: any,
        p15: (abc: any) => void,
        p16: false,
        p17: true,
        p18: string = "abc"
    ) {}

    @Decorate
    method(
        @Arg() p0: Symbol,
        p1: typeof sym,
        p2: string | null,
        p3: never,
        p4: string | never,
        p5: string | null,
        p6: Maybe<string>,
        p7: Object | string,
        p8: string & MyStringType,
        p9: string[],
        p10: [string, number],
        p11: void,
        p12: this is number,
        p13: null | undefined,
        p14: string | (string | null),
        p15: Object,
        p16: any,
        p17: bigint
    ) {}

    /**
     * Member Expression
     */
    @Decorate()
    method2(p0: Decorate.Name = "abc", p1: Decorate.Name) {}

    /**
     * Assignments
     */
    @Decorate()
    assignments(p0: string = "abc") {}
}
