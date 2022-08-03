var o = function() {
    console.log(f);
};
var f = 0;
f++ < 2 && typeof o == "function" && o();
f++ < 2 && typeof o == "function" && o();
f++ < 2 && typeof o == "function" && o();
