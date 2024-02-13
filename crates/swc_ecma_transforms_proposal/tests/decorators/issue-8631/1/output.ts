var _initProto;
const decorate = (target: unknown, context: DecoratorContext)=>{
    console.log("decorated");
};
export class Color {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                decorate,
                3,
                "rgba"
            ]
        ], []));
    }
    constructor(hex: string);
    constructor(r: number, g: number, b: number, a?: number);
    constructor(r: string | number, g?: number, b?: number, a = 1){
        _initProto(this);
    }
    get rgba() {
        return [
            0,
            0,
            0,
            1
        ];
    }
}
