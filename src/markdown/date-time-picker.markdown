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
      minTime: '<?',
      minutesGradient: '<?',
      increasedMinutes: '<?'
    },
    controller: ['$scope', '$timeout', '$filter', '$interval', controller]
  };
  function controller($scope, $timeout, $filter, $interval) {
    var intervalTimer = null;
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
        eventElem: '#' + $scope.dateId + '-event',
        trigger: 'click',
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
        eventElem: '#' + $scope.timeId + '-event',
        trigger: 'click',
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
      return newDateTime >= minDateTime;
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
    // 修正选择框中的值不小于当前时间
    $scope.fixDateTime = function() {
      var now = new Date();
      var dateStr = $scope.date.replace(/-/g, '/');
      var timeStr = $scope.time;
      // 有分钟梯度时，选择框中的时间秒数为 '00'
      // 无分钟梯度时，选择框中的时间秒数为 '59'(即当前时间的分钟数大于选择框中的分钟数才刷新)
      var secondsStr = $scope.minutesGradient ? '00' : '59';
      var date = new Date(dateStr + ' ' + timeStr + ':' + secondsStr);
      if (date > now) {
        return;
      }
      console.log('fixing...');
      $scope.date = $filter('date')(now, 'yyyy-MM-dd');
      var newTimeStr = $filter('date')(now, 'HH:mm');
      if($scope.minutesGradient) {
        newTimeStr = fixTime(newTimeStr, $scope.minutesGradient);
      }
      $scope.time = newTimeStr;
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
      if ($scope.date && $scope.time) {
        return;
      }
      var now = calcCurrDateTime();
      if(!$scope.date) {
        $scope.date = now.nowDate;
      }
      if(!$scope.time) {
        $scope.time = now.nowTime;
      }
    }
    // 计算当前时间
    function calcCurrDateTime() {
      var now = new Date();
      // 按分钟数增加时间
      if ($scope.increasedMinutes) {
        now = addMinutes(now, $scope.increasedMinutes);
      }
      var nowDate = $filter('date')(now, 'yyyy-MM-dd');
      var nowTime = $filter('date')(now, 'HH:mm');
      // 根据分钟梯度修正时间
      if ($scope.minutesGradient) {
        nowTime = fixTime(nowTime, $scope.minutesGradient);
      }
      return {
        nowDate: nowDate,
        nowTime: nowTime
      }
    }
    // 增加时间
    function addMinutes(date, increasedMinutes) {
      var retDate = new Date (date.getTime() + increasedMinutes*60*1000);
      var dateStr = $filter('date')(date, 'yyyy/MM/dd');
      var retDateStr = $filter('date')(retDate, 'yyyy/MM/dd');
      if (dateStr !== retDateStr) {
        return new Date(dateStr + ' 23:59'); // 防止时间增加后，变为第二天
      }
      return retDate;
    }
    // 使用分钟梯度向后修正时间
    function fixTime(timeStr, minutesGradient) {
      var maxDivideRes = 60 / minutesGradient - 1;
      var arr = timeStr.split(':');
      var hours = Number(arr[0]);
      var minutes = Number(arr[1]);
      var divideRes = minutes / minutesGradient;
      if (divideRes < maxDivideRes) {
        // 向上一个梯度不会超过 60 分
        minutes = (Math.floor(divideRes) + 1 ) * minutesGradient;
      }
      if (divideRes >= maxDivideRes) {
        // 向上一个梯度会超过 60 分
        if (hours >= 23) {
          minutes = 59;
        } else {
          hours++;
          minutes = 0;
        }
      }
      var hoursStr = ('00' + hours).slice(-2);
      var minutesStr = ('00' + minutes).slice(-2);
      return hoursStr + ':' + minutesStr;
    }
    // 定时器，修正时间使其不小于当前时间
    intervalTimer = $interval($scope.fixDateTime, 1000);
    // 取消定时器
    $scope.$on('$destroy', function() {
      $interval.cancel(intervalTimer);
    });
  }
}]);
```