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
require('./services/orderService')(app);




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
