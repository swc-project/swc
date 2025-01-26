let y: extends = 123; // Should not parse

import {type interface} from 'foo'; // Should not parse
import {type extends} from 'foo'; // Should not parse
import type {interface} from 'foo'; // Should not parse
import type {extends} from 'foo'; // Should not parse

import {type interface as a} from 'foo'; // Should parse
import {type extends as b} from 'foo'; // Should parse
import type {interface as a} from 'foo'; // Should parse
import type {extends as b} from 'foo'; // Should parse
