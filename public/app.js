(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(app){
  app.controller('accountsController', ['$scope', '$http', 'accountService', 'userService', function($scope, $http, accountService, userService){
    $scope.user = userService.getCurrentUser();
    $scope.myAccountsList = accountService.getMyAccounts($scope.user.repID);
    console.log($scope.myAccountsList);




  }]);
};

},{}],2:[function(require,module,exports){
module.exports = function(app){
  app.controller('inventoryController',['$scope', '$http', 'inventoryService', 'userService', function($scope, $http, inventoryService, userService){

    










  }]);
};

},{}],3:[function(require,module,exports){
module.exports = function(app) {
    app.controller('loginController', ['$scope', '$http', 'userService', function($scope, $http, userService) {



      $scope.login = function(){
        userService.login($scope.user,$scope.pass);
      }

    }]);
};

},{}],4:[function(require,module,exports){
module.exports = function(app) {
    app.controller('ordersController', ['$scope', '$http', function($scope, $http){







    }]);
};

},{}],5:[function(require,module,exports){
module.exports = function(app){
  app.controller('welcomeController',['$scope', '$http', function($scope, $http){







  }]);
};

},{}],6:[function(require,module,exports){
let app = angular.module('Tapp', ['ngRoute']);

// Controllers
require('./controllers/accountsController')(app);
require('./controllers/loginController')(app);
require('./controllers/ordersController')(app);
require('./controllers/inventoryController')(app);
require('./controllers/welcomeController')(app);

// Services
require('./services/userService')(app);
require('./services/inventoryService')(app);
require('./services/accountService')(app);



//router
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/welcome',
    })
    .when('/login', {
      controller: 'loginController',
      templateUrl: 'templates/login.html',
    })
    .when('/accounts', {
      controller: 'accountsController',
      templateUrl: 'templates/accounts.html',
    })
    .when('/orders', {
      controller: 'ordersController',
      templateUrl: 'templates/orders.html',
    })
    .when('/welcome', {
      controller: 'welcomeController',
      templateUrl: 'templates/welcome.html',
    })
    .when('/inventory', {
      controller: 'inventoryController',
      templateUrl: 'templates/inventory.html',
    });

}]);

},{"./controllers/accountsController":1,"./controllers/inventoryController":2,"./controllers/loginController":3,"./controllers/ordersController":4,"./controllers/welcomeController":5,"./services/accountService":7,"./services/inventoryService":8,"./services/userService":9}],7:[function(require,module,exports){
module.exports = function(app){


  app.factory('accountService',['$http', function($http){
    let accountList = [];
    let myAccountsList =[];


    return{


      getMyAccounts: function(repID){
        $http({
              method: 'GET',
              url: '/Api/accounts.json',
          }).then(function(response) {
            console.log("my accounts", response);
            angular.copy(response.data, accountList);
            accountList.forEach(function(el){
              if(el.repID === repID){
                myAccountsList.push(el);
              }
            })
          })
          // console.log("allsongs arrar", allSongList);
          return myAccountsList
      },

      // getPages: function(pageNum, perPage){
      //   console.log(eventList);
      //   let start = (pageNum - 1) * perPage;
      //   return eventList.slice(start, start + perPage)
      // },
    };
  }]);
};

},{}],8:[function(require,module,exports){
module.exports = function(app){


  app.factory('inventoryService',['$http', function($http){

    let myInventory =[];


    return{


      getMyAccounts: function(distributer){
        $http({
              method: 'GET',
              url: '/Api/inventory.json',
          }).then(function(response) {
            console.log("my inventory", response);
            angular.copy(response.data, inventory);
            inventory.forEach(function(el){
              if(el.distributer === distributer){
                myAccountList.push(el);
              }
            })
          })
          // console.log("allsongs arrar", allSongList);
          return myInventory
      },

      // getPages: function(pageNum, perPage){
      //   console.log(eventList);
      //   let start = (pageNum - 1) * perPage;
      //   return eventList.slice(start, start + perPage)
      // },
    };
  }]);
};

},{}],9:[function(require,module,exports){
module.exports = function(app){


  app.factory('userService',['$http', '$location', function($http, $location){

    let allUsers = [];
    let currentUser = {};

    return{
      login: function(user,pass) {
        $http({
              method: 'GET',
              url: '/Api/users.json',
          }).then(function(response) {
            console.log("all users", response);
            angular.copy(response.data, allUsers);
              allUsers.forEach(function(el){
                if (el.username === user && el.password === pass) {
                  console.log("users/pass match!");
                  angular.copy(el, currentUser)
                  $location.path('/accounts');
                }
              })
              console.log("not in if statement", currentUser);
              return currentUser;
          })
          // console.log("allsongs arrar", allSongList);
      },
      getCurrentUser: function() {
       console.log("user info", currentUser);
       return currentUser
     },
      getAllUsers: function(){
        $http({
              method: 'GET',
              url: '/users',
          }).then(function(response) {
            console.log("all users", response);
            angular.copy(response.data, allUsers);
          })
          return allUsers
      },

    };
  }]);
};

},{}]},{},[6])