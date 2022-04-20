var setEngine = function(name, version) {
    Browser.Engine.name = name, Browser.Engine[name + version] = !0, Browser.Engine.version = version;
};
if (Browser.ie) switch(Browser.Engine.trident = !0, Browser.version){
    case 6:
        setEngine('trident', 4);
        break;
    case 7:
        setEngine('trident', 5);
        break;
    case 8:
        setEngine('trident', 6);
}
if (Browser.firefox && (Browser.Engine.gecko = !0, setEngine('gecko', Browser.version >= 3 ? 19 : 18)), Browser.safari || Browser.chrome) switch(Browser.Engine.webkit = !0, Browser.version){
    case 2:
        setEngine('webkit', 419);
        break;
    case 3:
        setEngine('webkit', 420);
        break;
    case 4:
        setEngine('webkit', 525);
}
if (Browser.opera && (Browser.Engine.presto = !0, setEngine('presto', Browser.version >= 9.6 ? 960 : Browser.version >= 9.5 ? 950 : 925)), 'unknown' == Browser.name) switch((ua.match(/(?:webkit|khtml|gecko)/) || [])[0]){
    case 'webkit':
    case 'khtml':
        Browser.Engine.webkit = !0;
        break;
    case 'gecko':
        Browser.Engine.gecko = !0;
}
