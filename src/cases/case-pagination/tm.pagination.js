/**
 * name: tm.pagination
 * Version: 0.0.2
 */
angular.module('tm.pagination', []).directive('tmPagination', ['$timeout', function ($timeout) {
  return {
    restrict: 'EA',
    template: '<div class="page-list">' +
      '<ul class="pagination" ng-show="config.totalItems > 0">' +
      '<li ng-class="{disabled: config.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
      '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == config.currentPage, separate: item == \'...\'}" ' +
      'ng-click="changeCurrentPage(item)">' +
      '<span>{{ item }}</span>' +
      '</li>' +
      '<li ng-class="{disabled: config.currentPage == pagesLength}" ng-click="nextPage()"><span>&raquo;</span></li>' +
      '</ul>' +
      '<div class="page-total" ng-show="config.totalItems > 0">' +
      '第&nbsp;&nbsp;<input type="text" ng-model="currentPage" ng-model-options="{ debounce: 500 }" />&nbsp;&nbsp;页 ' +
      '&nbsp;&nbsp;每页&nbsp;&nbsp;<select ng-model="config.itemsPerPage" ng-options="option for option in config.perPageOptions "></select>条' +
      '&nbsp;&nbsp;共&nbsp;<strong>{{ config.totalItems }}</strong>&nbsp;条' +
      '</div>' +
      '<div class="no-items" ng-show="config.totalItems <= 0">暂无数据</div>' +
      '</div>',
    replace: true,
    scope: {
      config: '=',// 分页配置信息
      callback: '&',// 切换页面时的回调函数
    },
    link: function (scope, element, attrs) {
      let timer = null;
      const maxShownPage = 5;// 最大页码块数量
      // 初始化
      scope.currentPage = scope.config.currentPage;
      scope.pagesLength = Math.ceil(scope.config.totalItems / scope.config.itemsPerPage);
      scope.pageList = createPageList(scope.currentPage, scope.pagesLength);
      scope.callback();
      // 默认的每页显示条数的配置
      if (!scope.config.perPageOptions) {
        scope.config.perPageOptions = [10, 15, 20, 30, 50];
      }
      // 变更当前页
      scope.changeCurrentPage = function (item) {
        if (item !== '...') {
          scope.config.currentPage = item;
          scope.currentPage = item;
        }
      };
      // 向前翻页
      scope.prevPage = function () {
        if (scope.config.currentPage > 1) {
          scope.config.currentPage -= 1;
          scope.currentPage = scope.config.currentPage;
        }
      };
      // 向后翻页
      scope.nextPage = function () {
        const currentPage = scope.config.currentPage;
        const pagesLength = scope.pagesLength;
        if (currentPage < pagesLength) {
          scope.config.currentPage = currentPage + 1;
          scope.currentPage = scope.config.currentPage;
        }
      };
      // 监听当前页和每页显示条数，执行传入的回调函数
      scope.$watch('config.currentPage + "|" + config.itemsPerPage', function (newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        // let arr = newValue.split("|");
        // const currentPage = parseInt(arr[0]);
        // const itemsPerPage = parseInt(arr[1]);
        // let newPageSize = Math.ceil(scope.config.totalItems / itemsPerPage);
        // if (currentPage > newPageSize) {
        //   return;
        // }
        // 延时执行函数，防止修改每页显示条数后，当前页数大于总数时调用两次函数
        if (timer) {
          $timeout.cancel(timer);
          timer = $timeout(scope.callback, 100);
        } else {
          timer = $timeout(scope.callback, 100);
        }
      });
      // 监听每页显示条数和总条数，修改总页数和当前页数
      scope.$watch('config.itemsPerPage + "|" + config.totalItems', function (newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        const arr = newValue.split('|');
        const itemsPerPage = parseInt(arr[0]);
        const totalItems = parseInt(arr[1]);
        scope.pagesLength = Math.ceil(totalItems / itemsPerPage);
        if (scope.currentPage > scope.pagesLength) {
          scope.currentPage = scope.pagesLength;
        }
      });
      // 监听当前页和总页数，修改 pageList 数组
      scope.$watch(`config.currentPage  + "|" + pagesLength`, function (newValue, oldValue) {
        if (newValue === oldValue) {
          return;
        }
        const arr = newValue.split('|');
        let currentPage = parseInt(arr[0]);
        const pagesLength = parseInt(arr[1]);
        if (currentPage > pagesLength) {
          currentPage = scope.config.currentPage = pagesLength;
        }
        scope.pageList = createPageList(currentPage, pagesLength);
      });

      // 根据当前页和总页数生成数组 pageList: [1, '...', 3, 4, 5, '...', 10]
      function createPageList(currentPage, pagesLength) {
        let res = [];
        if (pagesLength <= maxShownPage) {
          // 页数在限制范围内
          for (let i = 0; i < pagesLength; i++) {
            res.push(i + 1);
          }
        } else {
          // 页数超出长度限制
          res.push(1);
          if (currentPage <= 2) {
            res.push(2, 3, 4);
          } else if (currentPage >= pagesLength - 1) {
            res.push(pagesLength - 3, pagesLength - 2, pagesLength - 1);
          } else {
            res.push(currentPage - 1, currentPage, currentPage + 1);
          }
          res.push(pagesLength);
          // 判断是否需要添加 '...'
          if ((res[maxShownPage - 1] - res[maxShownPage - 2]) > 1) {
            res.splice(maxShownPage - 1, 0, '...');
          }
          if ((res[1] - res[0]) > 1) {
            res.splice(1, 0, '...');
          }
        }
        return res;
      }

      // 监听当前页(scope.currentPage)
      scope.$watch('currentPage', function (newValue, oldValue) {
        // 判断新值是否为整数类型
        const REG_EXP = /^[0-9]+$/;
        if (!REG_EXP.test(newValue)) {
          scope.currentPage = oldValue;
          return;
        }
        newValue = parseInt(newValue);
        oldValue = parseInt(oldValue);
        if (newValue === oldValue) {
          return;
        }
        const currentPage = newValue;
        if (currentPage >= scope.pagesLength) {
          scope.currentPage = scope.pagesLength;
          scope.config.currentPage = scope.pagesLength;
          return;
        }
        if (currentPage < 1) {
          scope.currentPage = 1;
          scope.config.currentPage = 1;
          return;
        }
        scope.currentPage = newValue;
        scope.config.currentPage = newValue;
      })
    }
  };
}]);
