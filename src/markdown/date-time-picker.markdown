HTML 中使用组件 date-time-selector:
```html
<date-time-selector date="startDate" time="startTime"></date-time-selector>
<date-time-selector date="endDate" time="endTime" min-date="startDate" min-time="startTime"></date-time-selector>
```
组件定义：
```js
angular.module('myApp').directive('dateTimeSelector',[function() {
  return {
    templateUrl: './date-time-selector.template.html',
    scope: {
      date: '=',
      time: '=',
      minDate: '<?',
      minTime: '<?'
    },
    controller: ['$scope', '$timeout', '$filter', controller]
  };
  function controller($scope, $timeout, $filter) {
    initDateTime();
    var timer = null; // 防抖用定时器
    $scope.dateId = 'date-' + Math.random().toString(36).substr(2);
    $scope.timeId = 'time-' + Math.random().toString(36).substr(2);
    $scope.datePicker = null;
    $scope.timePicker = null;
    $timeout(function() {
      // 日期弹窗
      $scope.datePicker = laydate.render({
        elem: '#' + $scope.dateId, // 指定元素
        min: 'nowTime',
        type: 'date',
        done: function (value, date, endDate) {
          $scope.date = value;
          $scope.$apply();
        }
      });
      // 时间弹窗
      $scope.timePicker = laydate.render({
        elem: '#' + $scope.timeId, // 指定元素
        type: 'time',
        format: 'HH:mm',
        ready: function(date) {
          // 控件在打开时触发(打开时修改config，弹窗在点击后才会刷新新的配置)
        },
        change: function(value, date, endDate) {
          // 年月日时间被切换时都会触发
        },
        done: function(value, date, endDate) {
          $scope.time = value;
          $scope.$apply();
        }
      });
      $scope.minimumTimePicker();
    });
    // 字符串转Date对象
    $scope.convertStringToDate = function(dateStr, timeStr) {
      var dateTimeStr = dateStr + ' ' + timeStr;
      dateTimeStr = dateTimeStr.replace(/-/g, '/');
      return new Date(dateTimeStr);
    };
    // 当前时间是否满足最小要求
    $scope.isDateTimeAvailable = function() {
      var newDateTime = $scope.convertStringToDate($scope.date, $scope.time);
      var minDateTime = $scope.convertStringToDate($scope.minDate, $scope.minTime);
      if(newDateTime < minDateTime) {
        return false;
      }
      return true;
    };
    // 当前日期是否为今天
    $scope.isToday = function() {
      var date = $scope.date;
      var now = new Date();
      var nowDateStr = $filter('date')(now, 'yyyy-MM-dd');
      if (date === nowDateStr) {
        return true;
      }
    };
    // 修改时间弹窗的最小值
    $scope.minimumTimePicker = function() {
      console.log($scope.timePicker.config.min);
      // 打开弹窗时，限制小于当前时间的的选项
      var now = new Date();
      var nowDateStr = $filter('date')(now, 'yyyy/MM/dd');
      var limitDate = null;
      var minTime = $scope.minTime;
      if (minTime) {
        limitDate = new Date (nowDateStr + ' ' + minTime + ':00');
      } else if ($scope.isToday()) {
        limitDate = now;
      } else {
        limitDate = new Date (nowDateStr + ' ' + '00:00:00');
      }
      $scope.timePicker.config.min = {
        year: limitDate.getFullYear(),
        month: limitDate.getMonth(),
        date: limitDate.getDate(),
        hours: limitDate.getHours(),
        minutes: limitDate.getMinutes(),
        seconds: 0
      };
    };
    // 观测 scope.minDate 和 $scope.minTime
    $scope.$watchGroup(['minDate', 'minTime'], function(newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      $scope.date = $scope.minDate;
      if (!$scope.isDateTimeAvailable()) {
        $scope.time = $scope.minTime;
      }
      if(timer) {
        $timeout.cancel(timer);
      }
      timer = $timeout($scope.minimumTimePicker, 20);
    });
    // 观测 $scope.date
    $scope.$watch('date', function(newValue, oldValue) {
      if(newValue === oldValue) {
        return;
      }
      if($scope.isToday()) {
        var time = $scope.time;
        var timeNow = $filter('date')(new Date(), 'HH:mm');
        var timeNum = Number(time.replace(':', '.'));
        var timeNowNum = Number(timeNow.replace(':', '.'));
        if (timeNum < timeNowNum) {
          $scope.time = timeNow;
        }
      }
      if(timer) {
        $timeout.cancel(timer);
      }
      timer = $timeout($scope.minimumTimePicker, 20);
    });
    // 初始化日期和时间
    function initDateTime() {
      var now = new Date();
      var nowDate = $filter('date')(now, 'yyyy-MM-dd');
      var nowTime = $filter('date')(now, 'HH:mm');
      if(!$scope.date) {
        $scope.date = nowDate;
      }
      if(!$scope.time) {
        $scope.time = nowTime;
      }
    }
  }
}]);
```