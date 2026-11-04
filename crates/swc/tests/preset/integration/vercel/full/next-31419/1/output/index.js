import { _ as r } from "@swc/helpers/_/_async_to_generator";
import { _ as e } from "@swc/helpers/_/_ts_generator";
import { _ as n } from "@swc/helpers/_/_ts_values";
Promise.all(assignAll).then(function(t) {
    return r(function() {
        var r, s, i, c, o, u;
        return e(this, function(a) {
            switch(a.label){
                case 0:
                    for(o in r = function(r) {
                        var n;
                        return e(this, function(e) {
                            switch(e.label){
                                case 0:
                                    return n = t[r], s += "'".concat(n.id, "', "), [
                                        4,
                                        listOfUser(n.id)
                                    ];
                                case 1:
                                    return e.sent().forEach(function(r) {
                                        insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(n.id, "', now());");
                                    }), [
                                        2
                                    ];
                            }
                        });
                    }, s = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', c = [], i = t)c.push(o);
                    u = 0, a.label = 1;
                case 1:
                    if (!(u < c.length)) return [
                        3,
                        4
                    ];
                    if (!((o = c[u]) in i)) return [
                        3,
                        3
                    ];
                    return [
                        5,
                        n(r(o))
                    ];
                case 2:
                    a.sent(), a.label = 3;
                case 3:
                    return u++, [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    })();
});
export var listOfUser = function(n) {
    return new Promise(function(t, s) {
        return r(function() {
            var r;
            return e(this, function(e) {
                return r = 'Select Distinct id from "TABLE" Where id = \''.concat(n, "' And user_id IS not null"), postgreSQL.query(r, null, function(r, e) {
                    r ? s(r) : t(e.rows);
                }), [
                    2
                ];
            });
        })();
    });
};
