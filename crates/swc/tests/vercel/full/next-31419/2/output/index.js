var e;
import { _ as r } from "@swc/helpers/_/_async_to_generator";
Promise.all(assignAll).then((e = r(function*(e) {
    for(let e in obj){
        let r = obj[e];
        r.id, (yield listOfUser(r.id)).forEach((e)=>{
            insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${r.id}', now());`;
        });
    }
}), function(r) {
    return e.apply(this, arguments);
}));
export const listOfUser = function(e) {
    var n;
    return new Promise((n = r(function*(r, n) {
        let t = `Select Distinct id from "TABLE" Where id = '${e}' And user_id IS not null`;
        postgreSQL.query(t, null, function(e, t) {
            e ? n(e) : r(t.rows);
        });
    }), function(e, r) {
        return n.apply(this, arguments);
    }));
};
