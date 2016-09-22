module.exports = function(app){
  app.controller('accountsController', ['$scope', '$http', 'accountService', 'userService', function($scope, $http, accountService, userService){
    $scope.user = userService.getCurrentUser();
    $scope.myAccountsList = accountService.getMyAccounts($scope.user.repID);
    console.log($scope.myAccountsList);




  }]);
};
