function declaration(this: DeclarationContext /* keep */ , value: string): void {}
const expression = function(this: ExpressionContext, value: number): void {};
class Example {
    method(this: Example, value: boolean): void {}
}
const object = {
    method (this: ObjectContext, value: unknown): void {}
};
declare function ambient(this: Window, event: Event): void;
