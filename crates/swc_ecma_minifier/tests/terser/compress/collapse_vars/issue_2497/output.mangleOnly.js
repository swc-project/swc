function a() {
    if (true) {
        for(var a = 0; a < 1; ++a){
            for(var b = 0; b < 1; ++b){
                var c = 1;
                var d = c;
                c = d ? d + 1 : 0;
            }
        }
    } else {
        for(var a = 0; a < 1; ++a){
            for(var b = 0; b < 1; ++b){
                var c = 1;
            }
        }
    }
}
