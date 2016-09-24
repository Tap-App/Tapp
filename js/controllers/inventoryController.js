module.exports = function(app){
  app.controller('inventoryController',['$scope', '$http', 'inventoryService', 'userService', function($scope, $http, inventoryService, userService){

    $scope.user = userService.getCurrentUser();
    $scope.myInventory = inventoryService.getMyInventory($scope.user.distributer);
    console.log($scope.myInventory);










  }]);
};
