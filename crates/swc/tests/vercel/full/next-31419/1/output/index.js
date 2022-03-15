import * as a from "@swc/helpers";
import b from "regenerator-runtime";
Promise.all(assignAll).then(function() {
    var c = a.asyncToGenerator(b.mark(function a(c) {
        var d, e, f;
        return b.wrap(function(a) {
            for(;;)switch(a.prev = a.next){
                case 0:
                    for(f in d = function(f) {
                        var a = obj[f];
                        e += "'".concat(a.id, "', ");
                        var c = yield listOfUser(a.id);
                        c.forEach(function(b) {
                            insertQuery += "INSERT INTO \"TABLE\"(\"UUID\", id, other_ids_here) VALUES ('".concat(uuidv4(), "', '").concat(a.id, "', now());");
                        });
                    }, e = "DELETE FROM \"TABLE\" WHERE \"UUID\" IN ( ", obj)d(f);
                case 3:
                case "end":
                    return a.stop();
            }
        }, a);
    }));
    return function(c) {
        return c.apply(this, arguments);
    };
}());
export var listOfUser = function(d) {
    var c;
    return new Promise((c = a.asyncToGenerator(b.mark(function a(c, e) {
        var f;
        return b.wrap(function(a) {
            for(;;)switch(a.prev = a.next){
                case 0:
                    f = "Select Distinct id from \"TABLE\" Where id = '".concat(d, "' And user_id IS not null"), postgreSQL.query(f, null, function(a, b) {
                        a ? e(a) : c(b.rows);
                    });
                case 2:
                case "end":
                    return a.stop();
            }
        }, a);
    })), function(c, e) {
        return c.apply(this, arguments);
    }));
};
