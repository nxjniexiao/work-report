向后端查询会议室前，设置查询条件<span class="color-red">（修改后）</span>
```js
var pageSize = $scope.paginationConf.itemsPerPage;
var pageNo = $scope.paginationConf.currentPage;
var conditions = [];
if ($scope.searchConditions != null && $scope.searchConditions.length > 0) {
  conditions.push($scope.searchConditions);
}
if ($scope.meeting_group_id != null && $scope.meeting_group_id.length > 0) {
  conditions.push(['sql', 'meeting_group_id in (' + $scope.meeting_group_id + ')']);
}
$scope.QueryCondition = {
  pageSize: pageSize,
  pageNo: pageNo,
  conditions: conditions
};
```