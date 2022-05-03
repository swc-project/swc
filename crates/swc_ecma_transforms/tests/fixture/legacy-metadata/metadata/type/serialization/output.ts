import { Service } from './service';
import { Decorate } from './Decorate';
const sym = Symbol();
let Sample = class Sample {
    constructor(private p0: String, p1: Number, p2: 10, p3: 'ABC', p4: boolean, p5: string, p6: number, p7: Object, p8: () => any, p9: 'abc' | 'def', p10: String | Number, p11: Function, p12: null, p13: undefined, p14: any, p15: (abc: any) => void, p16: false, p17: true, p18: string = 'abc'){}
    method(p0: Symbol, p1: typeof sym, p2: string | null, p3: never, p4: string | never, p5: (string | null), p6: Maybe<string>, p7: Object | string, p8: string & MyStringType, p9: string[], p10: [string, number], p11: void, p12: this is number, p13: null | undefined, p14: (string | (string | null)), p15: Object, p16: any, p17: bigint) {}
    /**
     * Member Expression
     */ method2(p0: Decorate.Name = 'abc', p1: Decorate.Name) {}
    /**
     * Assignments
     */ assignments(p0: string = 'abc') {}
};
__decorate([
    Decorate,
    __param(0, Arg()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Symbol === "undefined" ? Object : Symbol,
        Object,
        Object,
        void 0,
        String,
        Object,
        typeof Maybe === "undefined" ? Object : Maybe,
        Object,
        Object,
        Array,
        Array,
        void 0,
        Boolean,
        Object,
        Object,
        typeof Object === "undefined" ? Object : Object,
        Object,
        Number
    ])
], Sample.prototype, "method", null);
__decorate([
    Decorate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof Decorate === "undefined" || typeof Decorate.Name === "undefined" ? Object : Decorate.Name,
        typeof Decorate === "undefined" || typeof Decorate.Name === "undefined" ? Object : Decorate.Name
    ])
], Sample.prototype, "method2", null);
__decorate([
    Decorate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        String
    ])
], Sample.prototype, "assignments", null);
Sample = __decorate([
    Decorate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [
        typeof String === "undefined" ? Object : String,
        typeof Number === "undefined" ? Object : Number,
        Number,
        String,
        Boolean,
        String,
        Number,
        typeof Object === "undefined" ? Object : Object,
        Function,
        String,
        Object,
        typeof Function === "undefined" ? Object : Function,
        void 0,
        void 0,
        Object,
        Function,
        Boolean,
        Boolean,
        String
    ])
], Sample);
