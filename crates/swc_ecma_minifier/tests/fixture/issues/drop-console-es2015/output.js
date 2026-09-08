const err = (()=>{}).bind();
err("boom");
process.stdout.write(typeof err + "\n");
let threw = false;
try {
    new ((()=>{}).bind())();
} catch (e) {
    threw = true;
}
process.stdout.write(threw + "\n");
