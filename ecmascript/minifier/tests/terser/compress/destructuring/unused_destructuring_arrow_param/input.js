let bar = ({ w: w = console.log("side effect"), x: x, y: z }) => {
    console.log(x);
};
bar({ x: 4, y: 5, z: 6 });
