import { getC } from './c';

export function a() {
    return new A()
}

export class A extends getC() {

}

export function getA() {
    return A;
}