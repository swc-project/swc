import { useEffect, useState } from 'react';
import { render } from 'react-dom';

import zhCN from 'antd/es/locale/zh_CN';
import { Button, ConfigProvider } from 'antd';

function App() {
  const [state, setState] = useState({});

  useEffect(() => {
    (async () => {
      setState(await fetch('/api/user'));
    })();
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      state: {state}
      <Button>Antd</Button>
    </ConfigProvider>
  );
}

render(<App />, document.getElementById('root'));