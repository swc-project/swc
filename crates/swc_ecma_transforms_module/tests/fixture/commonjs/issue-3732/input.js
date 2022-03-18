// index.ts
export * as get from "./get";

// get/index.ts

export const byID = (id) => {
    // Do some async stuff
    return new Promise((resolve) =>
        setTimeout(() => {
            resolve("result");
        }, 2000)
    );
};
