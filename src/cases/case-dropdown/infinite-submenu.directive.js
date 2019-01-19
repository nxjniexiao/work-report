angular.module('myApp').directive('infiniteSubmenu', [function() {
  return {
    templateUrl: 'src/cases/case-dropdown/infinite-submenu.template.html',
    restrict: 'E',
    scope: {
      listArray: '<'
    }
  };
}]);
