//// [asiPreventsParsingAsAmbientExternalModule02.ts]
var declare;
var module;
var container;
(function(container) {
    declare // this is the identifier 'declare'
    ;
    module // this is the identifier 'module'
    ;
    "my external module" // this is just a string
    ;
    {}
})(container || (container = {}));
