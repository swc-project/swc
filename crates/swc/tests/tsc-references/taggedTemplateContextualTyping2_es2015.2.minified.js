function tempTag2(...rest) {}
tempTag2`${(x)=>{
    return x(void 0), x;
}}${0}`, tempTag2`${(x)=>{
    return x(void 0), x;
}}${(y)=>{
    return y(null), y;
}}${"hello"}`, tempTag2`${(x)=>{
    return x(void 0), x;
}}${void 0}${"hello"}`;
