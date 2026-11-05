namespace Unique__2 {
    export const value__3 = 5;
    export function read__3(value__4: number) {
        return value__4;
    }
    export namespace Child__3 {
        export const inherited__5 = value__3;
        export function readOuter__5() {
            return value__3;
        }
    }
}
function left__2() {
    namespace Local__7 {
        export const value__8 = 7;
    }
    return Local__7.value;
}
function right__2() {
    namespace Local__9 {
        export const value__10 = 11;
    }
    return Local__9.value;
}
console.log(Unique__2.read(13), Unique__2.Child.inherited, Unique__2.Child.readOuter(), left__2(), right__2());
