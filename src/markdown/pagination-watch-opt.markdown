页面中引入组件：
```html
<tm-pagination config="paginationConfig" callback="filterListArray()"></tm-pagination>
```
<span class="color-red">组件内部</span>监听页面变化:
```js
directive("tmPagination", [
  function() {
    return {
      // 省略...
      scope: {
        config: "=", // 分页配置信息
        callback: "&" // 切换页面时的回调函数
      },
      link: function(scope, element, attrs) {
        scope.$watch(
          'config.currentPage + "|" + config.itemsPerPage',
          function(newVal, oldVal) {
            // 省略...
            callback(); // 执行回调函数
          }
        );
      }
    };
  }
]);
```