type Box<T> = {
    value: T;
    nested: {
        count: number;
    };
    makeValue: <U>(value: U) => U;
};

type CounterMap = Record<string, number>;

function mutateBox<T>(box: Box<T>, counters: CounterMap, next: T) {
    (box.value) = next;
    (box.value as T) = next;
    (box.value satisfies T) = next;
    (box.value!) = next;
    (<T>box.value) = next;
    (box.makeValue<T>) = (value: T) => value;

    (box.nested.count)++;
    (box.nested.count as number)++;
    (box.nested.count satisfies number)++;
    (box.nested.count!)++;
    (<number>box.nested.count)++;

    for ((box.nested.count) in counters) {
        break;
    }

    for ((box.nested.count as number) in counters) {
        break;
    }
}

class BaseCounter {
    value = 0;
}

class DerivedCounter extends BaseCounter {
    update() {
        (super.value) = 1;
        (super.value as number) = 2;
        (super.value!)++;
    }
}

export function App() {
    const box: Box<number> = {
        value: 0,
        nested: {
            count: 0,
        },
        makeValue(value) {
            return value;
        },
    };

    mutateBox(box, { zero: 0 }, 1);
    new DerivedCounter().update();

    return null;
}
