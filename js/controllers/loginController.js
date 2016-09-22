module.exports = function(app) {
    app.controller('loginController', ['$scope', '$http', 'userService', function($scope, $http, userService) {



      $scope.login = function(){
        userService.login($scope.user,$scope.pass);
      }

    }]);
};
