import { _ as r } from "@swc/helpers/_/_async_to_generator";
import { _ as n } from "@swc/helpers/_/_ts_generator";
import { _ as t } from "@swc/helpers/_/_ts_values";
Promise.all(assignAll).then(function() {
    var e = r(function(r) {
        var e, s, i, c, o;
        return n(this, function(u) {
            switch(u.label){
                case 0:
                    for(c in e = function(t) {
                        var e;
                        return n(this, function(n) {
                            switch(n.label){
                                case 0:
                                    return e = r[t], s += "'".concat(e.id, "', "), [
                                        4,
                                        listOfUser(e.id)
                                    ];
                                case 1:
                                    return n.sent().forEach(function(r) {
                                        insertQuery += 'INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES (\''.concat(uuidv4(), "', '").concat(e.id, "', now());");
                                    }), [
                                        2
                                    ];
                            }
                        });
                    }, s = 'DELETE FROM "TABLE" WHERE "UUID" IN ( ', i = [], r);
                    o = 0, u.label = 1;
                case 1:
                    if (!(o < i.length)) return [
                        3,
                        4
                    ];
                    return [
                        5,
                        t(e(i[o]))
                    ];
                case 2:
                    u.label = 3;
                case 3:
                    return o++, [
                        3,
                        1
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return function(r) {
        return e.apply(this, arguments);
    };
}());
export var listOfUser = function(t) {
    var e;
    return new Promise((e = r(function(r, e) {
        var s;
        return n(this, function(n) {
            return s = 'Select Distinct id from "TABLE" Where id = \''.concat(t, "' And user_id IS not null"), postgreSQL.query(s, null, function(n, t) {
                n ? e(n) : r(t.rows);
            }), [
                2
            ];
        });
    }), function(r, n) {
        return e.apply(this, arguments);
    }));
};
