var strOrNum;
function f4() {
    return strOrNum;
}
strOrNum = "string" == typeof f4() && f4(); // string | number 
