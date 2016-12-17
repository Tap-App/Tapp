module.exports = function(app) {
    app.controller('inventoryController', ['$scope', '$http', 'inventoryService', 'userService', function($scope, $http, inventoryService, userService) {
        $scope.loading = 0;
        $scope.user = userService.getCurrentUser();
        $scope.myInventory = inventoryService.getMyInventoryServer($scope.user.distributer);
        console.log($scope.myInventory);
        $scope.editBeer = false;
        $scope.showInputs = function(){
          $scope.editBeer = true;
        }
        $scope.cancelInputs= function(){
          $scope.editBeer = false;
        }
        $scope.showBeerDets = function(beer) {
            $scope.beerDets = beer;
        }
        $scope.updateBeerInfo = function(editInput,setField){
          console.log("id to update", $scope.beerDets._id);
          console.log("input Value", editInput);
          console.log("feild to update", setField);
          $http({
            method: 'PUT',
            url:'/updateBeerInfo',
            data: {_id: $scope.beerDets._id , field: setField, editVal : editInput}

          }).then(function(response){
            inventoryService.getMyInventoryServer($scope.user.distributer);
            $scope.nameInput = "";
            $scope.breweryInput = "";
            $scope.typeInput = "";
            $scope.descriptionInput = "";
            $scope.qtyCasesInput = "";
            $scope.qtyHalfBarrelsInput = "";
            $scope.qtySixtelsInout = "";
            $scope.qtyQBInput = "";
            $scope.priceHBInput ="";
            $scope.priceCasesInput = "";
            $scope.priceSixtelInput = "";
            $scope.priceQBInput = "";

          })
        }
        $scope.addBeer = function() {
            $scope.loading++;
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
                    qtyQB: $scope.qtyQB,
                    qtyHalfBarrels: $scope.qtyHalfBarrels,
                    priceCases: $scope.priceCases,
                    priceSixtel: $scope.priceSixtel,
                    priceHB: $scope.priceHB,
                    priceQB: $scope.priceQB,
                    distributer: $scope.user.distributer
                },
            }).then(function(response) {
                $scope.loading--;
                // After a response, reload the inventory and clear the fields
                inventoryService.getMyInventoryServer($scope.user.distributer);
                $scope.name = "";
                $scope.brewery = "";
                $scope.beerType = "";
                $scope.description = "";
                $scope.qtyCases = "";
                $scope.qtySixtels = "";
                $scope.qtyHalfBarrels = "";
                $scope.qtyQB = "";
                $scope.priceCases = "";
                $scope.priceSixtel = "";
                $scope.priceHB = "";
                $scope.priceQB = "";
            })
        };







    }]);
};
