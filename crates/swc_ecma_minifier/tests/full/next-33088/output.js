import*as a from"react";export default function b(){const[c,d]=a.useState({hits:[]}),[b,e]=a.useState("react");return a.useEffect(()=>{async function a(){const a=await fetch("https://hn.algolia.com/api/v1/search?query="+b),c=await a.json();d(c)}""!==b&&a()},[b]),<>

            <input value={b}onChange={a=>e(a.target.value)}/>

            <ul >

                {c.hits.map(a=><li key={a.objectID}>

                        <a href={a.url}>{a.title}</a>

                    </li>)}

            </ul>

        </>}
