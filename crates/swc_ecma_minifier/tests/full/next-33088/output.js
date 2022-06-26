import*as b from"react";export default function c(){const[c,d]=b.useState({hits:[]}),[e,f]=b.useState("react");return b.useEffect(()=>{""!==e&&b();async function b(){const b=await fetch("https://hn.algolia.com/api/v1/search?query="+e),c=await b.json();d(c)}},[e]),<>

            <input value={e}onChange={b=>f(b.target.value)}/>

            <ul >

                {c.hits.map(b=><li key={b.objectID}>

                        <a href={b.url}>{b.title}</a>

                    </li>)}

            </ul>

        </>}
