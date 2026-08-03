function optionalThis(this?: Context) {}
function initializedThis(this = value) {}
function optionalInitializedThis(this?: Context = value) {}
function nestedObject({ this = value }) {}
function nestedArray([this = value]) {}
function misplacedThis(value: unknown, this: Context, this: OtherContext) {}
function misplacedInitializedThis(value: unknown, this = fallback) {}
class Accessors {
    constructor(this = fallback) {}
    get value(this?: Context) {
        return fallback;
    }
    set value(this?: Context, value: number) {}
}
const object = {
    get value(this?: Context) {
        return fallback;
    },
    set value(this?: Context, value: number) {}
};
type Signature = (this = fallback) => void;
