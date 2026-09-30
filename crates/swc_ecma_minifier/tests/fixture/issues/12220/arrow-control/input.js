function F(){return (() => new.target)()}console.log(new F() === F);
