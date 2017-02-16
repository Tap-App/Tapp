module.exports = function(app) {
    app.controller('ordersController', ['$scope', '$http', 'userService', 'orderService', function($scope, $http, userService, orderService){
      $scope.loading = 0;
      $scope.user = userService.getCurrentUser();
      $scope.allOrders = orderService.getAllOrders();
      $scope.notDelivOrders = orderService.getDistOrdersNotDeliv($scope.user.distributer);
      $scope.delivOrders = orderService.getDistOrdersDeliv($scope.user.distributer);
      $scope.updateOrderDets = false;

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
        console.log("match with", $scope.user.username);
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

      $scope.reOrder = function(orderDets) {
        console.log("orderDets", orderDets);
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = mm + '/' + dd + '/' + yyyy;

        $http({
          method: 'POST',
          url: '/orders',
          data: {
              distributer: $scope.user.distributer,
              username: orderDets.username,
              repName: orderDets.repName,
              accountName: orderDets.accountName,
              orderDate: today,
              totalBeerPrice: orderDets.totalBeerPrice,
              totalKegs: orderDets.totalKegs,
              totalPriceWitDeposit: orderDets.totalPriceWitDeposit,
              totalDeposit: orderDets.totalDeposit,
              beers: orderDets.beers,
              deliveryDate: orderDets.deliveryDate,
              delivered: false
          },

        }).then(function(response){
          $scope.notDelivOrders = orderService.getDistOrdersNotDeliv($scope.user.distributer);
          $scope.delivOrders = orderService.getDistOrdersDeliv($scope.user.distributer);
        })
      }

      $scope.showUpdate = function() {
        $scope.updateOrderDets = true;
      }


    }]);
};
