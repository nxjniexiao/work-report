向后端查询会议室前，设置查询条件<span class="color-red">（修改前）</span>
```js
if ($scope.searchConditions != null && $scope.searchConditions.length > 0) {
  if ($scope.meeting_group_id == null || $scope.meeting_group_id.length <= 0) {
    $scope.QueryCondition = {
      pageSize: $scope.paginationConf.itemsPerPage,
      pageNo: $scope.paginationConf.currentPage,
      conditions: [$scope.searchConditions]
    };
  } else {
    $scope.QueryCondition = {
      pageSize: $scope.paginationConf.itemsPerPage,
      pageNo: $scope.paginationConf.currentPage,
      conditions: [
        $scope.searchConditions,
        ['sql', 'meeting_group_id in (' + $scope.meeting_group_id + ')']
      ]
    };
  }
} else {
  if ($scope.meeting_group_id == null || $scope.meeting_group_id.length <= 0) {
    $scope.QueryCondition = {
      pageSize: $scope.paginationConf.itemsPerPage,
      pageNo: $scope.paginationConf.currentPage
    };
  } else {
    $scope.QueryCondition = {
      pageSize: $scope.paginationConf.itemsPerPage,
      pageNo: $scope.paginationConf.currentPage,
      conditions: [
        ['sql', 'meeting_group_id in (' + $scope.meeting_group_id + ')']
      ]
    };
  }
}
```