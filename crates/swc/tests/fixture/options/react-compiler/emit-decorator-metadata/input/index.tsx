function dec(...args: any[]) {}

class Service {}

class Controller {
    @dec
    value: Service;
}

export function App() {
    return <div />;
}
