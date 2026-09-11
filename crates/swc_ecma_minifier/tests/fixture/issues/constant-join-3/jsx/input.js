const React = {
    createElement() {
        return {
            toString() {
                return "s";
            },
            valueOf() {
                return 1;
            },
        };
    },
};

function X() {}

const element = [<X />].join("");
const fragment = [<></>].join("");
