"use strict";
import { arrayUtilities } from "necessary";

const { second } = arrayUtilities;

const elements = [1, 2, 3],
    secondElement = second(elements);

console.log(secondElement)