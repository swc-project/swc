var e = function(e, r) {
    Browser.Engine.name = e;
    Browser.Engine[e + r] = true;
    Browser.Engine.version = r;
};
if (Browser.ie) {
    Browser.Engine.trident = true;
    switch(Browser.version){
        case 6:
            e("trident", 4);
            break;
        case 7:
            e("trident", 5);
            break;
        case 8:
            e("trident", 6);
    }
}
if (Browser.firefox) {
    Browser.Engine.gecko = true;
    if (Browser.version >= 3) e("gecko", 19);
    else e("gecko", 18);
}
if (Browser.safari || Browser.chrome) {
    Browser.Engine.webkit = true;
    switch(Browser.version){
        case 2:
            e("webkit", 419);
            break;
        case 3:
            e("webkit", 420);
            break;
        case 4:
            e("webkit", 525);
    }
}
if (Browser.opera) {
    Browser.Engine.presto = true;
    if (Browser.version >= 9.6) e("presto", 960);
    else if (Browser.version >= 9.5) e("presto", 950);
    else e("presto", 925);
}
if (Browser.name == "unknown") {
    switch((ua.match(/(?:webkit|khtml|gecko)/) || [])[0]){
        case "webkit":
        case "khtml":
            Browser.Engine.webkit = true;
            break;
        case "gecko":
            Browser.Engine.gecko = true;
    }
}
