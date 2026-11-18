import {useReactTable} from '@tanstack/react-table';
import {useEffect} from 'react';

function Toolbar() {
  return <button />;
}

export function Page({items}) {
  useEffect(() => {
    const table = 'shadow';
    console.log(table);
  }, []);
  const titles = items.map(section => section.title);
  const sections = items.map(section => <section key={section.id}>{section.title}<section.Component><section.Component.Nested /></section.Component></section>);
  const names = items.map(Component => Component.name);
  const components = items.map(Component => <Component />);
  const table = useReactTable({});
  return <table><Toolbar table={table} />{titles.join(',')}{sections}{names.join(',')}{components}</table>;
}
