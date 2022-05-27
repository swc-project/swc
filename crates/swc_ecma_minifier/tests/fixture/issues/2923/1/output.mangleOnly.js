export default function a(a) {
    const b = ()=>{
        return "test";
    };
    return a`${b()}`;
};
