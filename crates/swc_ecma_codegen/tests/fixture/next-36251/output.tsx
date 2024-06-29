type ü = {
    name: string;
    value: string;
};
export const SomeComponent = ({ name, value }: ü)=>{
    return (<div>
            {name} {value}
        </div>);
};
