##### DEMO 1 - 根据容纳人数筛选会议室
```js
$scope.galleryfulList = [
  { id: 0, name: "全部", value: null },
  { id: 1, name: "0-10", value: 10 },
  { id: 2, name: "11-20", value: 20 },
  { id: 3, name: "21-30", value: 30 },
  { id: 3, name: "31-40", value: 40 },
  { id: 4, name: "40人以上", value: 41 }
];
if ($scope.sel.selectedGalleryful.value != null) {
  var rooms = [];
  if ($scope.sel.selectedGalleryful.value != 41) {
    for (var i = 0; i < $scope.meetingRooms.length; i++) {
      if (
        $scope.meetingRooms[i].galleryful >
          $scope.sel.selectedGalleryful.value - 10 &&
        $scope.meetingRooms[i].galleryful <= $scope.sel.selectedGalleryful.value
      ) {
        rooms.push($scope.meetingRooms[i]);
      }
    }
  } else {
    for (var i = 0; i < $scope.meetingRooms.length; i++) {
      if ($scope.meetingRooms[i].galleryful > 40) {
        rooms.push($scope.meetingRooms[i]);
      }
    }
  }
  $scope.meetingRooms = rooms;
}
```