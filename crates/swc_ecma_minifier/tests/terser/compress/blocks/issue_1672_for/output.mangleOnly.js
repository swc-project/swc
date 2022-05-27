switch(function() {
    return a;
}){
    case a:
        for(; console.log("FAIL");){
            function a() {}
        }
        break;
}
