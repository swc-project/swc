import t from "@swc/helpers/src/_async_to_generator.mjs";
import n from "regenerator-runtime";
Promise.all(assignAll).then(function() {
    var r = t(n.mark(function t(r) {
        var e, c, a, o;
        return n.wrap(function(t) {
            for(;;)switch(t.prev = t.next){
                case 0:
                    e = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', t.t0 = regeneratorRuntime.keys(r);
                case 2:
                    if ((t.t1 = t.t0()).done) {
                        t.next = 12;
                        break;
                    }
                    return a = r[c = t.t1.value], e += "'".concat(a.id, "', "), t.next = 8, listOfUser(a.id);
                case 8:
                    (o = t.sent).forEach(function(t) {
                        insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(a.id, "', now());");
                    }), t.next = 2;
                    break;
                case 12:
                case "end":
                    return t.stop();
            }
        }, t);
    }));
    return function(r) {
        return r.apply(this, arguments);
    };
}());
export var listOfUser = function(r) {
    var e;
    return new Promise((e = t(n.mark(function t(e, c) {
        var a;
        return n.wrap(function(t) {
            for(;;)switch(t.prev = t.next){
                case 0:
                    a = 'Select Distinct id from "TABLE" Where id = \''.concat(r, "' And user_id IS not null"), postgreSQL.query(a, null, function(t, n) {
                        t ? c(t) : e(n.rows);
                    });
                case 2:
                case "end":
                    return t.stop();
            }
        }, t);
    })), function(e, c) {
        return e.apply(this, arguments);
    }));
};
