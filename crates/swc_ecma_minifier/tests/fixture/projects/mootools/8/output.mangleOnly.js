var a = function(a, b) {
    Browser.Engine.name = a;
    Browser.Engine[a + b] = true;
    Browser.Engine.version = b;
};
if (Browser.ie) {
    Browser.Engine.trident = true;
    switch(Browser.version){
        case 6:
            a("trident", 4);
            break;
        case 7:
            a("trident", 5);
            break;
        case 8:
            a("trident", 6);
    }
}
if (Browser.firefox) {
    Browser.Engine.gecko = true;
    if (Browser.version >= 3) a("gecko", 19);
    else a("gecko", 18);
}
if (Browser.safari || Browser.chrome) {
    Browser.Engine.webkit = true;
    switch(Browser.version){
        case 2:
            a("webkit", 419);
            break;
        case 3:
            a("webkit", 420);
            break;
        case 4:
            a("webkit", 525);
    }
}
if (Browser.opera) {
    Browser.Engine.presto = true;
    if (Browser.version >= 9.6) a("presto", 960);
    else if (Browser.version >= 9.5) a("presto", 950);
    else a("presto", 925);
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
