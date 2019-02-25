angular.module('myApp').directive('dateTimeSelector',[function() {
  return {
    templateUrl: 'src/cases/case-date-time-picker/date-time-selector.template.html',
    scope: {
      time: '=',
      minTime: '<?',
      maxTime: '<?',
      mode: '@?',
      isSameDay: '<?',
      minutesGradient: '<?',
      increasedMinutes: '<?'
    },
    controller: ['$scope', '$timeout', '$filter', '$interval', controller]
  };
  function controller($scope, $timeout, $filter, $interval) {
    var intervalTimer = null;
    var timer = null; // 防抖用定时器
    $scope.dateId = 'date-' + Math.random().toString(36).substr(2);
    $scope.timeId = 'time-' + Math.random().toString(36).substr(2);
    $scope.dateStr = null; // 日期字符串，如'2019-02-25'
    $scope.timeStr = null; // 时间字符串，如'11::30'
    $scope.datePicker = null;
    $scope.timePicker = null;
    $timeout(function () {
      // 日期弹窗
      $scope.datePicker = laydate.render({
        elem: '#' + $scope.dateId, // 指定元素
        eventElem: '#' + $scope.dateId + '-event',
        trigger: 'click',
        min: 'nowTime',
        type: 'date',
        done: function (value, date, endDate) {
          $scope.dateStr = value;
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
        ready: function (date) {
          // 控件在打开时触发(打开时修改config，弹窗在点击后才会刷新新的配置)
        },
        change: function (value, date, endDate) {
          // 年月日时间被切换时都会触发
        },
        done: function (value, date, endDate) {
          $scope.timeStr = value;
          $scope.$apply();
        }
      });
      $scope.minimumPicker();
      $scope.maximumPicker();
    });
    // 字符串转Date对象
    $scope.convertStringToDate = function (dateStr, timeStr) {
      var dateTimeStr = dateStr + ' ' + timeStr;
      dateTimeStr = dateTimeStr.replace(/-/g, '/');
      return new Date(dateTimeStr);
    };
    // 当前日期是否为今天
    $scope.isToday = function () {
      var dateStr = $scope.dateStr;
      var now = new Date();
      var nowDateStr = $filter('date')(now, 'yyyy-MM-dd');
      if (dateStr === nowDateStr) {
        return true;
      }
    };
    // 修改时间弹窗的最小值
    $scope.minimumPicker = function () {
      console.log($scope.datePicker.config);
      // 打开弹窗时，限制小于当前时间的的选项
      var now = new Date();
      // 时间选择框最小值
      var minTime = $scope.minTime;
      var limitForTimePicker = calcLimitForTimePicker(now, minTime);
      // 日期选择框最小值
      var limitForDatePicker = (minTime - now) ? minTime : now;
      $scope.datePicker.config.min = {
        year: limitForDatePicker.getFullYear(),
        month: limitForDatePicker.getMonth(),
        date: limitForDatePicker.getDate(),
        hours: limitForDatePicker.getHours(),
        minutes: limitForDatePicker.getMinutes(),
        seconds: 0
      };
      $scope.timePicker.config.min = {
        year: limitForTimePicker.getFullYear(),
        month: limitForTimePicker.getMonth(),
        date: limitForTimePicker.getDate(),
        hours: limitForTimePicker.getHours(),
        minutes: limitForTimePicker.getMinutes(),
        seconds: 0
      };
    };
    // 修改时间弹窗的最大值
    $scope.maximumPicker = function () {
      console.log($scope.datePicker.config);
      var maxTime = $scope.maxTime;
      if (!maxTime) {
        return;
      }
      // 日期选择框最小值
      var limitForDatePicker = maxTime;
      $scope.datePicker.config.max = {
        year: limitForDatePicker.getFullYear(),
        month: limitForDatePicker.getMonth(),
        date: limitForDatePicker.getDate(),
        hours: limitForDatePicker.getHours(),
        minutes: limitForDatePicker.getMinutes(),
        seconds: 0
      };
    };
    // 修正选择框中的值不小于当前时间
    $scope.fixDateTime = function () {
      var now = new Date();
      var dateStr = $scope.dateStr.replace(/-/g, '/');
      var timeStr = $scope.timeStr;
      // 有分钟梯度时，选择框中的时间秒数为 '00'
      // 无分钟梯度时，选择框中的时间秒数为 '59'(即当前时间的分钟数大于选择框中的分钟数才刷新)
      var secondsStr = $scope.minutesGradient ? '00' : '59';
      var date = new Date(dateStr + ' ' + timeStr + ':' + secondsStr);
      if (date > now) {
        return;
      }
      console.log('fixing...');
      $scope.dateStr = $filter('date')(now, 'yyyy-MM-dd');
      var newTimeStr = $filter('date')(now, 'HH:mm');
      if ($scope.minutesGradient) {
        newTimeStr = fixTime(newTimeStr, $scope.minutesGradient);
      }
      $scope.timeStr = newTimeStr;
    };
    // 监听 dateStr 和 timeStr
    $scope.$watchGroup(['dateStr', 'timeStr'], function () {
      var dateStr = $scope.dateStr;
      var timeStr = $scope.timeStr;
      $scope.time = $scope.convertStringToDate(dateStr, timeStr);
      if (timer) {
        $timeout.cancel(timer);
      }
      timer = $timeout($scope.minimumPicker, 20); // 修正选择框中的最小值
    });
    // 监听 minTime
    $scope.$watch('minTime', function () {
      if (timer) {
        $timeout.cancel(timer);
      }
      timer = $timeout($scope.minimumPicker, 20); // 修正选择框中的最小值
      var time = $scope.time;
      var minTime = $scope.minTime;
      if (time < minTime) {
        $scope.dateStr = $filter('date')(minTime, 'yyyy-MM-dd');
        var currTimeNum = Number($filter('date')(time, 'HH.mm'));
        var minTimeNum = Number($filter('date')(minTime, 'HH.mm'));
        if (currTimeNum <= minTimeNum) {
          $scope.timeStr = $filter('date')(minTime, 'HH:mm');
        }
      }
      // dateStr 等于最小日期的 dateStr
      if ($scope.isSameDay) {
        $scope.dateStr = $filter('date')(minTime, 'yyyy-MM-dd');
      }
    });
    // 监听 maxTime
    $scope.$watch('maxTime', function () {
      if (timer) {
        $timeout.cancel(timer);
      }
      timer = $timeout($scope.maximumPicker, 20); // 修正选择框中的最大值
      var time = $scope.time;
      var maxTime = $scope.maxTime;
      if (time > maxTime) {
        $scope.dateStr = $filter('date')(maxTime, 'yyyy-MM-dd');
        $scope.timeStr = $filter('date')(maxTime, 'HH:mm');
      }
    });
    // 初始化日期和时间
    function initDateTime() {
      var time = $scope.time;
      if (!time) {
        var date = calcNowDateTime();
        $scope.dateStr = date.dateStr;
        $scope.timeStr = date.timeStr;
        return;
      }
      $scope.dateStr = $filter('date')(time, 'yyyy-MM-dd');
      $scope.timeStr = $filter('date')(time, 'HH:mm');
    }

    // 计算时间
    function calcNowDateTime() {
      var date = new Date();
      // 按分钟数增加时间
      if ($scope.increasedMinutes) {
        date = addMinutes(date, $scope.increasedMinutes);
      }
      var dateStr = $filter('date')(date, 'yyyy-MM-dd');
      var timeStr = $filter('date')(date, 'HH:mm');
      // 根据分钟梯度修正时间
      if ($scope.minutesGradient) {
        timeStr = fixTime(timeStr, $scope.minutesGradient);
      }
      return {
        dateStr: dateStr,
        timeStr: timeStr
      }
    }

    // 计算时间选择框的最小值
    function calcLimitForTimePicker(now, minTime) {
      var nowDateStr = $filter('date')(now, 'yyyy/MM/dd');
      // 有最小日期时间限制
      if (minTime) {
        var dateStr = $scope.dateStr;
        var minDateStr = $filter('date')(minTime, 'yyyy-MM-dd');
        var minTimeStr = $filter('date')(minTime, 'HH:mm');
        var timeStr = (dateStr === minDateStr) ? minTimeStr : '00:00';
        return new Date(nowDateStr + ' ' + timeStr + ':00');
      }
      // 当天
      if ($scope.isToday()) {
        return now;
      }
      // 非当天
      return new Date(nowDateStr + ' ' + '00:00:00');
    }

    // 增加时间
    function addMinutes(date, increasedMinutes) {
      var retDate = new Date(date.getTime() + increasedMinutes * 60 * 1000);
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
        minutes = (Math.floor(divideRes) + 1) * minutesGradient;
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
    $scope.$on('$destroy', function () {
      $interval.cancel(intervalTimer);
    });
    initDateTime();
  }
}]);
