module.exports = function(app) {
    app.controller('ordersController', ['$scope', '$http', 'userService', 'orderService', function($scope, $http, userService, orderService){

      $scope.user = userService.getCurrentUser();
      $scope.allOrders = orderService.getAllOrders();
      $scope.distOrders = orderService.getDistOrders($scope.user.distributer);
      $scope.myOrders = orderService.getMyOrders($scope.user.username);

      $scope.delivered = function(id){
        $http({
          method: 'PUT',
          url: `/orders/${id}`

        }).then(function(response){
          console.log("deliverd");
        })
      }




    }]);
};
