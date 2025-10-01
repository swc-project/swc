// Test various import merging scenarios
import React from 'react';
import { useState, useEffect } from 'react';
import { Component } from 'react';
import ReactDom from 'react-dom';

import * as utils from 'utils';
import { helper1 } from 'utils';
import { helper2 } from 'utils';

import foo from 'single-import';

// Should result in:
// import React, { useState, useEffect, Component } from 'react';
// import ReactDom from 'react-dom';
// import * as utils from 'utils';
// import { helper1, helper2 } from 'utils';  // Note: namespace import prevents merging of named imports
// import foo from 'single-import';

export function App() {
    const [count, setCount] = useState(0);
    useEffect(() => {}, []);
    return React.createElement(Component, null, ReactDom.render(null, null), utils.something(), helper1(), helper2(), foo);
}