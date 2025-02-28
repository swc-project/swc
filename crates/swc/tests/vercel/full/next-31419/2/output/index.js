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
export const listOfUser = function(n) {
    var e;
    return new Promise((e = r(function*(r, t) {
        let e = `Select Distinct id from "TABLE" Where id = '${n}' And user_id IS not null`;
        postgreSQL.query(e, null, function(e, n) {
            e ? t(e) : r(n.rows);
        });
    }), function(r, n) {
        return e.apply(this, arguments);
    }));
};
