// @strict: true
// @target: es2017
// #41347, based on microsoft/rushstack

// Mixin utilities
                                                            
                                                       

                                                                                           

// Base class
class ApiItem {
         get members()                         {
    return [];
  }
}

// Normal subclass
class ApiEnumMember extends ApiItem {
}

// Mixin base class
                                                 
                                           
 

function ApiItemContainerMixin                                        (
  baseClass            
)                                                               {
           class MixedClass extends baseClass                                  {
    public constructor(...args       ) {
      super(...args);
    }

           get members()                         {
      return [];
    }
  }

  return MixedClass;
}

// Subclass inheriting from mixin
export class ApiEnum extends ApiItemContainerMixin(ApiItem) {
  // This worked prior to TypeScript 4.0:
         get members()                               {
    return [];
  }
}
