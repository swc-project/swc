function tempTag1(...rest) {
}
tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${10}`, tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(undefined);
    return y;
}}${10}`, tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(undefined);
    return y;
}}${undefined}`, tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(undefined);
    return y;
}}${undefined}`;
