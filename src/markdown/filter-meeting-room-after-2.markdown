封装变化：
```js
// 根据人数容量筛选会议室
function filterRoomsByGalleryful(meetingRooms) {
  var selectedGalleryful = $scope.sel.selectedGalleryful; // 下拉菜单所选择的对象
  var min = selectedGalleryful.min; // 最小值
  var max = selectedGalleryful.max; // 最大值
  var filterFn = getFilterFn(min, max);
  return meetingRooms.filter(filterFn);
}
// 根据最大值最小值返回筛选数组的函数
function getFilterFn(min, max) {
  return function(item) {
    var galleryful = item.galleryful;
    if (min && max) {
      return galleryful >= min && galleryful <= max;
    }
    if (min && !max) {
      return galleryful >= min;
    }
    if (!min && max) {
      return galleryful <= max;
    }
    return true;
  };
}
```