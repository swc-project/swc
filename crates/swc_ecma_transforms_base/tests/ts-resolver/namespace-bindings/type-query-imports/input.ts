import type Fs = require("review-value");
type T = typeof Fs;
type Property = { [Fs.value]: true };
type Method = { [Fs.value](): void };
namespace Source { export const value = 1; }
namespace N {
    export import Alias = Source.value;
}
namespace N {
    export type External = typeof Fs;
    export type Internal = typeof Alias;
}
