import type { HiddenThis } from "hidden";
export class PrivateAccessors {
    private get getter(this: HiddenThis): string {
        return "";
    }

    private set setter(this: HiddenThis, value: string) {}
}
export function untypedDeclaration(this): void {}
export const untypedExpression = function (this): void {};
export class UntypedMethod {
    method(this): void {}
}
export class UntypedSetter {
    set value(this, value: string) {}
}
export const untypedObjectMethod = {
    method(this): void {},
};
