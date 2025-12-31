(function(ns) {
    ns.a = 1;
})(ns || (ns = {}));
(function(ns2) {
    ns2.a = 1;
})(ns2 || (ns2 = {}));
(function(ns3) {
    ns3.b = ns3.a;
})(ns3 || (ns3 = {}));
(function(ns4) {
    (function(ns5) {
        ns5.b = a;
    })(ns4.ns5 || (ns4.ns5 = {}));
})(ns4 || (ns4 = {}));
export var ns, ns2, ns3, ns4;
