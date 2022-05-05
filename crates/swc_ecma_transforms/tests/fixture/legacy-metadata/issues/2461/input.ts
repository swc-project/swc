const ThingDecorator: PropertyDecorator = () => {};

class Thing {
    @ThingDecorator
    thing?: string | null;
}
