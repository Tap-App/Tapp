module.exports = function(app){
  app.controller('inventoryController',['$scope', '$http', 'inventoryService', 'userService', function($scope, $http, inventoryService, userService){

    $scope.user = userService.getCurrentUser();
    $scope.myInventory = inventoryService.getMyInventoryServer($scope.user.distributer);
    console.log($scope.myInventory);

    $scope.addBeer = function() {
            $http({
                method: 'POST',
                url: '/inventory',
                contentType: "application/json",
                data: {
                  name: $scope.name,
                  brewery: $scope.brewery,
                  beerType: $scope.beerType,
                  description: $scope.description,
                  qtyCases: $scope.qtyCases,
                  qtySixtels: $scope.qtySixtels,
                  qtyHalfBarrels: $scope.qtyHalfBarrels,
                  unitPrice: $scope.unitPrice,
                  distributer: $scope.user.distributer
                },
            }).then(function(response){
        // After a response, reload the inventory and clear the fields
        inventoryService.getMyInventoryServer($scope.user.distributer);
        $scope.name = "";
        $scope.brewery = "";
        $scope.beerType = "";
        $scope.description = "";
        $scope.qtyCases = "";
        $scope.qtySixtels = "";
        $scope.qtyHalfBarrels= "";
        $scope.unitPrice = "";
      })
    };







  }]);
};
