页面中引入组件：
```html
<tm-pagination config="paginationConfig"></tm-pagination>
```
<span class="color-red">页面中</span>监听页面变化:
```js
$scope.$watch(
  'paginationConf.currentPage + "|" + paginationConf.itemsPerPage',
  function(newVal, oldVal) {
    if (newVal == oldVal) return;
    var new_val_array = newVal.split("|");
    var old_val_array = oldVal.split("|");
    var pageSize = Math.ceil($scope.paginationConf.totalItems / $scope.paginationConf.itemsPerPage);
    if (new_val_array[0] > pageSize) return;
    if (!$scope.ids) $scope.initUser(0);
    else $scope.initUser($scope.ids);
  }, true);
```