(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(app){
  app.controller('accountsController', ['$scope', '$http', function($scope, $http){







  }]);
};

},{}],2:[function(require,module,exports){
module.exports = function(app){
  app.controller('inventoryController',['$scope', '$http', function($scope, $http){












  }]);
};

},{}],3:[function(require,module,exports){
module.exports = function(app){
  app.controller('loginController',['$scope', '$http', function($scope, $http){







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

},{"./controllers/accountsController":1,"./controllers/inventoryController":2,"./controllers/loginController":3,"./controllers/ordersController":4,"./controllers/welcomeController":5}]},{},[6])