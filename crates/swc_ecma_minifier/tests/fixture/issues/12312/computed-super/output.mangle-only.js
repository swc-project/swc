class Base{["o"](){return 1}}class Child extends Base{read(){return super["o"]()}}const obj=new Child;console.log(obj.read(),obj["o"](),"o"in obj);
