module.exports = function(app){
  app.controller('accountsController', ['$scope', '$http', '$q', 'accountService', 'userService', function($scope, $http, $q, accountService, userService){
    $scope.user = userService.getCurrentUser();
    $scope.myAccountsList = accountService.getMyAccountsServer($scope.user.repId);
    console.log($scope.myAccountsList);

    $scope.addAcct = function() {
            $http({
                method: 'POST',
                url: '/accounts',
                data: {
                    repId: $scope.repId,
                    accountName: $scope.accountName,
                    contact: $scope.contact,
                    email: $scope.email,
                    phone: $scope.phone,
                    address: $scope.address
                },
            }).then(function(response) {
                console.log(response);
                accountService.getMyAccountsServer($scope.user.repId);

                $scope.repId = "";
                $scope.accountName = "";
                $scope.contact = "";
                $scope.email = "";
                $scope.phone = "";
                $scope.address = "";
            })
        };

    $scope.rmAcct = function(acctId, acctName){
      console.log("acct id to delete", acctId);
      var check =  confirm(`are you sure you want to permenently Delete Acct: ${acctName}`);
      if (check) {
        console.log("make a delete request");
        $http({
          method:'DELETE',
          url:`/accounts/${acctId}`
        }).then(function(response){
          console.log(`reload ${$scope.user.userName}'s accounts'`);
          accountService.getMyAccountsServer($scope.user.repId);
        })
      } else {
        console.log(`${acctName} was not deleted`);
      }
    }


  }]);
};
