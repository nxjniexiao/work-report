app.js 中，获取了全部1431条未读消息：
```js
$scope.query = function() {
  NoticeService.query({}, function(data) {
    $rootScope.allNotices = data.data.data;
    $rootScope.headNotices = $filter("filter")($rootScope.allNotices, { status: 1 });
  });
};
```
修改如下：
```js
$scope.query = function() {
  NoticeService.query({}, function(data) {
    $rootScope.allNotices = data.data.data;
    var headNotices = $filter("filter")($rootScope.allNotices, { status: 1 });
    $rootScope.unreadMessageNum = headNotices.length;
    $rootScope.headNotices = headNotices.slice(0, 20);
  });
};
```