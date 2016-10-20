module.exports = function(app) {
    app.controller('ordersController', ['$scope', '$http', 'userService', 'orderService', function($scope, $http, userService, orderService){

      $scope.user = userService.getCurrentUser();
      $scope.allOrders = orderService.getAllOrders();
      $scope.distOrders = orderService.getDistOrders($scope.user.distributer);
      $scope.myOrders = orderService.getMyOrders($scope.user.username);






    }]);
};
