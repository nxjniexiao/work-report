函数内部结构
```js
// 创建会议
if (!MeetingReserve.uuid) {
  if ($scope.meeting.is_forever == 1) {
    // 永久会议
  } else if ($scope.meeting.is_foreverOrNow == 1 && $scope.isMixed != 1) {
    // 立即视频会议
  } else if ($scope.meeting.is_foreverOrNow == 1 && $scope.isMixed == 1) {
    // 混合会议立即开始
  } else if ($scope.isMixed == 1) {
    // 正常预约混合会议
  } else {
    // 正常预约
  }
}
// 修改会议
if (MeetingReserve.uuid) {
  if ($scope.meeting.is_forever == 1) {
    // 改成永久会议
  } else if ($scope.meeting.is_foreverOrNow == 1 && $scope.isMixed != 1) {
    // 改成立即会议
  } else if ($scope.isMixed == 1) {
    // 修改预约的混合会议
  } else {
    // 修改并审批
  }
}
```