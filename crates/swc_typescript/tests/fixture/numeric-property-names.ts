export class NumericPropertyNames {
    get 1e21(): string {
        return "";
    }

    set "1e+21"(value) {}

    get 1e999(): number {
        return 0;
    }

    set "Infinity"(value) {}
}

export const computedNumericPropertyNames = {
    get [1e21](): string {
        return "";
    },

    set ["1e+21"](value) {},

    get [1e999](): number {
        return 0;
    },

    set ["Infinity"](value) {},
};
