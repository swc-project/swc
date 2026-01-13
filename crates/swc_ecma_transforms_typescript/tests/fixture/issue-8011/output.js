(function(API) {
    API.url = "/";
    function update(value) {
        API.url = value;
    }
    API.update = update;
})(API || (API = {}));
API.update("/new");
console.log(API.url);
var API;
