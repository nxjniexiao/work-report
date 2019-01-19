子菜单组件 infinite-submenu:
```js
angular.module('myApp').directive('infiniteSubmenu', [function() {
  return {
    templateUrl: 'infinite-submenu.template.html',
    restrict: 'E',
    scope: {
      listArray: '<'
    }
  };
}]);
```
模板文件 (模板内部递归地使用组件本身):
```html
<ul class="dropdown-menu">
  <li ng-repeat="item in listArray" ng-class="{'dropdown-submenu': item.children}">
    <a href="#" data-company-id="{{item.value}}" data-company-name="{{item.label}}">{{item.label}}</a>
    <infinite-submenu ng-if="item.children" list-array="item.children"></infinite-submenu>
  </li>
</ul>
```