var setEngine = function (name, version) {
    Browser.Engine.name = name;
    Browser.Engine[name + version] = true;
    Browser.Engine.version = version;
};

if (Browser.ie) {
    Browser.Engine.trident = true;

    switch (Browser.version) {
        case 6: setEngine('trident', 4); break;
        case 7: setEngine('trident', 5); break;
        case 8: setEngine('trident', 6);
    }
}

if (Browser.firefox) {
    Browser.Engine.gecko = true;

    if (Browser.version >= 3) setEngine('gecko', 19);
    else setEngine('gecko', 18);
}

if (Browser.safari || Browser.chrome) {
    Browser.Engine.webkit = true;

    switch (Browser.version) {
        case 2: setEngine('webkit', 419); break;
        case 3: setEngine('webkit', 420); break;
        case 4: setEngine('webkit', 525);
    }
}

if (Browser.opera) {
    Browser.Engine.presto = true;

    if (Browser.version >= 9.6) setEngine('presto', 960);
    else if (Browser.version >= 9.5) setEngine('presto', 950);
    else setEngine('presto', 925);
}

if (Browser.name == 'unknown') {
    switch ((ua.match(/(?:webkit|khtml|gecko)/) || [])[0]) {
        case 'webkit':
        case 'khtml':
            Browser.Engine.webkit = true;
            break;
        case 'gecko':
            Browser.Engine.gecko = true;
    }
}