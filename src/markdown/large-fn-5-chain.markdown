把四个对象练成一条链，然后执行请求。

```js
var processMeeting = processForeverMeeting
  .after(processForeverOrNowMeeting)
  .after(processMixedMeeting)
  .after(processNormalMeeting);

processMeeting(); // 处理会议
```
优点：各节点之间互不影响，可灵活地拆分重组。

缺点：叠加了函数的作用域，链条太长会对性能有影响。

**注**：不支持异步。<br>