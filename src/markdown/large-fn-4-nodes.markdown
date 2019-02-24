修改节点对象：判断是否能处理，不能处理时，返回'NEXT_NODE'。

```js
// 永久会议
function processForeverMeeting() {
  // 不为永久会议，交给下个节点处理
  if ($scope.meeting.is_forever !== 1) {
    return 'NEXT_NODE';
  }
  // 处理永久会议...
}

// 立即视频、混合会议
function processForeverOrNowMeeting() {
  // 不为立即会议，交给下个节点处理
  if ($scope.meeting.is_foreverOrNow !== 1) {
    return 'NEXT_NODE';
  }
  // 处理立即视频、混合会议...
}

// 正常预约混合会议
function processMixedMeeting() {
  // 不为混合会议，交给下个节点处理
  if ($scope.isMixed !== 1) {
    return 'NEXT_NODE';
  }
  // 处理混合会议...
}

// 正常会议
function processNormalMeeting() {
  // 处理正常会议...
}
```