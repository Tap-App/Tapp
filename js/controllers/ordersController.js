module.exports = function(app) {
    app.controller('ordersController', ['$scope', '$http', 'userService', 'orderService', function($scope, $http, userService, orderService){
      $scope.loading = 0;
      $scope.user = userService.getCurrentUser();
      $scope.allOrders = orderService.getAllOrders();
      $scope.notDelivOrders = orderService.getDistOrdersNotDeliv($scope.user.distributer);
      $scope.delivOrders = orderService.getDistOrdersDeliv($scope.user.distributer);

      $scope.delivered = function(id){
        $scope.loading ++;
        $http({
          method: 'PUT',
          url: `/orders/${id}`

        }).then(function(response){
          $scope.loading --;
          console.log("deliverd");
          orderService.getDistOrdersNotDeliv($scope.user.distributer);
          orderService.getDistOrdersDeliv($scope.user.distributer);
        })
      };

      $scope.showDetails = function(order){
        console.log("show details for", order);
        $scope.orderDets = order;
      }

      $scope.cancelOrder = function(id) {
        $scope.loading ++;
        console.log(id, 'object id to cancel');
        $http({
          method: 'DELETE',
          url: `/orders/${id}`

        }).then(function(response){
          alert('Successfully Canceled Order')
          orderService.getDistOrdersNotDeliv($scope.user.distributer);
          orderService.getDistOrdersDeliv($scope.user.distributer);
          $scope.loading --;
        })
      }



    }]);
};
