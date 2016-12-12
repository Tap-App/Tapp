module.exports = function(app) {
    app.controller('loginController', ['$scope', '$http', 'userService', function($scope, $http, userService) {
      $scope.loading = 0;


      $scope.login = function(){
        userService.login($scope.user,$scope.pass);
      }
      $scope.createUser = function(){
        $scope.loading ++;
        console.log("creating user", $scope.newName);
        $http({
          method: 'POST',
          url: '/users',
          data: {
            access : $scope.newAccess,
            repId : $scope.newRepId,
            username : $scope.newUserName,
            name : $scope.newName,
            password: $scope.newPassword,
            distributer: $scope.newDistributer
          }
        }).then(function(response){
          $scope.loading --;
          console.log(response);
          alert(response.data);
          $scope.newAccess = "";
          $scope.newRepId = "";
          $scope.newUserName = "";
          $scope.newName = "";
          $scope.newPassword = "";
          $scope.newDistributer = "";
        })
      }
    }]);
};
