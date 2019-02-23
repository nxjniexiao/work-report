把创建和修改会议封装到一个函数中
```js
// 创建、修改会议
if ($scope.meeting.is_forever == 1) {
  // 永久会议
  processForeverMeeting();
}else if ($scope.meeting.is_foreverOrNow == 1) {
  // 立即视频、混合会议
  processForeverOrNowMeeting();
} else if($scope.isMixed == 1) {
  // 正常预约混合会议
  processMixedMeeting();
} else{
  // 正常预约
  processNormalMeeting()
}
```