export const Externals = {
    Pinkie: "Pinkie Pie",
};

const Ponies = {
    name: Externals.Pinkie,
};

type Pony = keyof typeof Ponies;

export const magical = (): string => {
    const pinkie = (): Pony => "name";

    console.log(Ponies.name);
    return pinkie();
};
