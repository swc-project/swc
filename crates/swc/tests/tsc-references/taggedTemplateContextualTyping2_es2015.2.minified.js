function tempTag2(...rest) {
}
tempTag2`${(x)=>{
    x(undefined);
    return x;
}}${0}`, tempTag2`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(null);
    return y;
}}${"hello"}`, tempTag2`${(x)=>{
    x(undefined);
    return x;
}}${undefined}${"hello"}`;
