module.exports= function(app){
  app.controller('bearIslandController', ['$scope', 'inventoryService', function($scope, inventoryService){

    $scope.inventory = inventoryService.getMyInventoryServer('AB')



  }])
};
