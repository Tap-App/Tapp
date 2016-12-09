module.exports = function(app) {
    app.controller('ordersController', ['$scope', '$http', 'userService', 'orderService', function($scope, $http, userService, orderService){

      $scope.user = userService.getCurrentUser();
      $scope.allOrders = orderService.getAllOrders();
      $scope.notDelivOrders = orderService.getDistOrdersNotDeliv($scope.user.distributer);
      $scope.delivOrders = orderService.getDistOrdersDeliv($scope.user.distributer);

      $scope.delivered = function(id){
        $http({
          method: 'PUT',
          url: `/orders/${id}`

        }).then(function(response){
          console.log("deliverd");
          orderService.getDistOrdersNotDeliv($scope.user.distributer);
          orderService.getDistOrdersDeliv($scope.user.distributer);
        })
      };

      $scope.showDetails = function(order){
        console.log("show details for", order);
        $scope.orderDets = order;
      }




    }]);
};
