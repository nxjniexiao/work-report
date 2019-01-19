HTML 中使用组件 infinite-dropdown:
```html
<infinite-dropdown selected-item="selectedCompany" list-array="companiesArray"></infinite-dropdown>
```
组件定义：
```js
angular.module('myApp').directive('infiniteDropdown', [function() {
  return {
    templateUrl: 'infinite-dropdown.template.html',
    restrict: 'E',
    scope: {
      selectedItem: '=',
      listArray: '<'
    },
    link: function(scope, element, attrs) {
      element.on('click', function(event) {
        //省略...
      });
    }
  };
}]);
```