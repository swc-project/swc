import { foo } from './b';

function lazy() {
    foo()
}

lazy();
