const err = console.error.bind(console);
err("boom");
process.stdout.write(typeof err + "\n");

let threw = false;
try {
    new (console.error.bind(console))();
} catch (e) {
    threw = true;
}
process.stdout.write(threw + "\n");
