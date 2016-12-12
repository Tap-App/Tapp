module.exports = function(app){
  app.controller('inventoryController',['$scope', '$http', 'inventoryService', 'userService', function($scope, $http, inventoryService, userService){
    $scope.loading = 0;
    $scope.user = userService.getCurrentUser();
    $scope.myInventory = inventoryService.getMyInventoryServer($scope.user.distributer);
    console.log($scope.myInventory);

    $scope.showBeerDets = function(beer){
      $scope.beerDets = beer;
    }

    $scope.addBeer = function() {
      $scope.loading ++;
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
                  priceCases: $scope.priceCases,
                  priceSixtel: $scope.priceSixtel,
                  priceHB: $scope.priceHB,
                  distributer: $scope.user.distributer
                },
            }).then(function(response){
              $scope.loading --;
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
