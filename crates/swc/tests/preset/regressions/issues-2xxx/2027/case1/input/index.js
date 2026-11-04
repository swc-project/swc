const keys = {
    a: 1,
    b: 2,
};

const controller = {};

for (const key in keys) {
    controller[key] = (c, ...d) => {
        console.log(keys[key]);
    };
}
