class Person {
    constructor(public name: string, public location: string) {}
}

type PersonConstructor = new (name: string, location: string) => Person;

const PersonsInJail: () => PersonConstructor = () => {
    return class extends Person {
        isInJail(): boolean {
            return this.name === "Sideshow Bob";
        }
    };
};

const NemesisLocation: ReturnType<typeof PersonsInJail> = PersonsInJail();

export class KrustyShow extends NemesisLocation {}
