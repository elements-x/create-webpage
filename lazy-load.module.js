angular.module('lazyLoading',[])
  .component('childAngularComponent', ChildAngularComponent)
  .component('childChildAngularComponent', ChildChildAngularComponent);

var ChildAngularComponent = {
  template: `
    <div>
      <h2>I'm Child Angular Component</h2>
      <p>form.value: {{$ctrl.form.value}}</p>

      <child-child-angular-component form="$ctrl.form">
        <h3>I'm Child Child Angular Component</h3>
      </child-child-angular-component>
    </div>
    `,
  bindings: {
    form: '<'
  },
  controller: class {
  }
};

var ChildChildAngularComponent = {
  template: `
    <div>
      <ng-transclude></ng-transclude>
      
      <p>form.value: {{$ctrl.form.value}}
        <button ng-click="$ctrl.add(1)">+1</button>
        <button ng-click="$ctrl.add(-1)">-1</button>  
      </p>

      myVar: <input ng-model="$ctrl.myVar" /> 
      <span ng-if="$ctrl.myVar.length > 2">
        {{$ctrl.myVar}}  (visible if more than 2 chars)
      </span>
    </div>
    `,
  transclude: true,
  bindings: {
    form: '<'  // from <child-child-angular-comopnent form="..."></child-child-angular-component>
  },
  controller: class {
    constructor() {
      this.myVar = 'ng-if';
    }
    add(val) {
      this.form.value += val;
    }
  }
};
