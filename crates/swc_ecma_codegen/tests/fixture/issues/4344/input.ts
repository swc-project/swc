function logParameter(target: Object, propertyName: string) {
  console.log(target, propertyName);
}


function logClass(target: Function) {
  console.log(target)
}

@logClass
export class Employee {
  @logParameter
  name: string;
}