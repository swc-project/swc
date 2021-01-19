let bar = ({ w: w = console.log("side effect"), x: x }) => {
    console.log(x);
};
bar({ x: 4, y: 5, z: 6 });
