import type Fs__2 = require("review-value");
type T__2 = typeof Fs__2;
type Property__2 = {
    [Fs__2.value]: true;
};
type Method__2 = {
    [Fs__2.value](): void;
};
namespace Source__2 {
    export const value__3 = 1;
}
namespace N__2 {
    export import Alias__4 = Source__2.value;
}
namespace N__2 {
    export type External__5 = typeof Fs__2;
    export type Internal__5 = typeof Alias__4;
}
