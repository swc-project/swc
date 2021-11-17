import * as a from "@swc/helpers";
Promise.all(assignAll).then(function(a) {
    var c = a.asyncToGenerator(function*(a) {
        let b = "DELETE FROM \"TABLE\" WHERE \"UUID\" IN ( ";
        for(let c in obj){
            let d = obj[c];
            b += `'${d.id}', `;
            let e = yield listOfUser(d.id);
            e.forEach((a)=>{
                insertQuery += `INSERT INTO "TABLE"("UUID", id, other_ids_here) VALUES ('${uuidv4()}', '${d.id}', now());`;
            });
        }
    });
    return function() {
        return c.apply(this, arguments);
    };
}());
export const listOfUser = function(b) {
    return new Promise(function(a, c) {
        var e = a.asyncToGenerator(function*(a, c) {
            const d = `Select Distinct id from "TABLE" Where id = '${b}' And user_id IS not null`;
            postgreSQL.query(d, null, function(a, b) {
                a ? (void 0)(a) : (void 0)(b.rows);
            });
        });
        return function() {
            return e.apply(this, arguments);
        };
    }());
};
