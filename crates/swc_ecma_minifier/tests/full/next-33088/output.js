import*as b from"react";export default function c(){const[d,e]=b.useState({hits:[]}),[c,f]=b.useState("react");return b.useEffect(()=>{""!==c&&b();async function b(){const b=await fetch("https://hn.algolia.com/api/v1/search?query="+c),d=await b.json();e(d)}},[c]),<>

            <input value={c}onChange={b=>f(b.target.value)}/>

            <ul >

                {d.hits.map(b=><li key={b.objectID}>

                        <a href={b.url}>{b.title}</a>

                    </li>)}

            </ul>

        </>}
