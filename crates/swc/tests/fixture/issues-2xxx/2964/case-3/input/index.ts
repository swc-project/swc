// single line comment
const x = ({ y, ...rest }: /*todo: refactor any type*/ any) => {
    return {
        y, // another comment
        z: rest.z, // final comment
    };
};
