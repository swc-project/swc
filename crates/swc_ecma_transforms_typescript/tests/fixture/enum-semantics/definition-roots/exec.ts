const offset = 4;
namespace Container {
    export function fromFunction(value: number): number;
    export function fromFunction(value: number) {
        const enum Local { A = offset, B }
        return Local.B + value;
    }
    export class Holder {
        static fromMethod() {
            enum Local { A = 7 }
            return Local.A;
        }
        read() {
            const enum Local { A = 3 }
            return Local.A;
        }
        field = (function () {
            const enum Local { A = 6 }
            return Local.A;
        })();
    }
    export function throughExpression() {
        const read = () => {
            const enum Local { A = 9 }
            return Local.A;
        };
        return read();
    }
    export function plain() { return 2; }
    export class Plain { value = 3; }
}
const result = [
    Container.fromFunction(1), Container.Holder.fromMethod(),
    new Container.Holder().read(), new Container.Holder().field,
    Container.throughExpression(), Container.plain(), new Container.Plain().value,
];

expect(result).toEqual([6, 7, 3, 6, 9, 2, 3]);
