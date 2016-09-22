module.exports = function(app){
  app.controller('accountsController', ['$scope', '$http', 'accountService', 'userService', function($scope, $http, accountService, userService){

    $scope.myAccountsList = accountService.getMyAccounts("1");
    console.log($scope.myAccountsList);




  }]);
};
