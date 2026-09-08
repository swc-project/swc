"use client";
import { Fragment as _TsrxFragment11 } from "react";
function ControlFlow(items: Item[], record: Record<string, Item>, stream: AsyncIterable<Item>) {
    const visible = items.length > 0;
    return <main>
        {visible ? <Visible/> : items.length === 0 ? (()=>{
        const reason = "empty";
        return <Hidden reason={reason}/>;
    })() : <Unknown/>}

        {(()=>{
        const _TsrxResults = [];
        let _TsrxEntered1 = false;
        for(let i = 0; i < items.length; i++){
            _TsrxEntered1 = true;
            if (!items[i]) continue;
            if (i > 20) break;
            _TsrxResults.push(<ClassicRow item={items[i]}/>);
        }
        return _TsrxEntered1 ? _TsrxResults : <NoClassicRows/>;
    })()}

        {(()=>{
        const _TsrxResults2 = [];
        let _TsrxEntered3 = false;
        for(const name in record){
            _TsrxEntered3 = true;
            _TsrxResults2.push(<NamedRow name={name}/>);
        }
        return _TsrxEntered3 ? _TsrxResults2 : <NoNames/>;
    })()}

        {(()=>{
        const _TsrxResults4 = [];
        let _TsrxEntered5 = false;
        let _TsrxIndex6 = 0;
        for (const item of items){
            _TsrxEntered5 = true;
            let index = _TsrxIndex6++;
            const label = `${index}:${item.name}`;
            _TsrxResults4.push(<Row item={item} label={label} key={item.id}/>);
        }
        return _TsrxEntered5 ? _TsrxResults4 : <Empty/>;
    })()}

        {(()=>{
        const _TsrxResults7 = [];
        let _TsrxEntered8 = false;
        for (const item of items){
            _TsrxEntered8 = true;
            _TsrxResults7.push(<Row key="source-key" item={item}/>);
        }
        return _TsrxResults7;
    })()}

        {(()=>{
        const _TsrxResults9 = [];
        let _TsrxEntered10 = false;
        for (const item of items){
            _TsrxEntered10 = true;
            _TsrxResults9.push(<_TsrxFragment11 key={item.id}>{<><Row item={item}/></>}</_TsrxFragment11>);
        }
        return _TsrxResults9;
    })()}

        {(async ()=>{
        const _TsrxResults12 = [];
        let _TsrxEntered13 = false;
        for await (const item of stream){
            _TsrxEntered13 = true;
            _TsrxResults12.push(<AsyncRow item={item}/>);
        }
        return _TsrxEntered13 ? _TsrxResults12 : <NoAsyncRows/>;
    })()}

        {(()=>{
        switch(items.length){
            case 0:
                {
                    const message = "fall through";
                }
            case 1:
                {
                    return <One/>;
                }
            default:
                {
                    break;
                }
        }
        return null;
    })()}
    </main>;
}
