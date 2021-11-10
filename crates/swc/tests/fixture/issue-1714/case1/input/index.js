import { customRender } from './customRender';

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
