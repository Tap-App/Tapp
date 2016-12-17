(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(app) {
    app.controller('accountsController', ['$scope', '$http', '$q', 'accountService', 'userService', 'inventoryService', 'orderService', function($scope, $http, $q, accountService, userService, inventoryService, orderService) {

        $scope.loading = 0;

        $scope.user = userService.getCurrentUser();
        $scope.myAccountsList = accountService.getMyAccountsServer($scope.user.repId);
        console.log($scope.myAccountsList);
        $scope.editContact = false;
        $scope.editPhone = false;
        $scope.editAddress = false;

        // show and hide edit contact input
        $scope.showContact = function() {
            $scope.editContact = true;
        }
        $scope.cancelEditContact = function() {
                $scope.editContact = false;
            }
            // show and hide edit phone input
        $scope.showPhone = function() {
            $scope.editPhone = true;
        }
        $scope.cancelEditPhone = function() {
                $scope.editPhone = false;
            }
            // show and hide edit address input
        $scope.showAddress = function() {
            $scope.editAddress = true;
        }
        $scope.cancelEditAddress = function() {
            $scope.editAddress = false;
        }
        $scope.updateInfo = function (editInput,setField) {
          console.log("field to update", setField);
          console.log("update the contact", editInput);
          console.log("Id to update", $scope.accountDets._id);
          $http({
            method: 'PUT',
            url:'/updateAccountInfo',
            data: {_id: $scope.accountDets._id , field: setField, editVal : editInput}

          }).then(function(response){
            accountService.getMyAccountsServer($scope.user.repId);
          })
        }

        // Add an Account
        $scope.addAcct = function() {
            $scope.loading++;
            $http({
                method: 'POST',
                url: '/accounts',
                data: {
                    repId: $scope.user.repId,
                    accountName: $scope.accountName,
                    contact: $scope.contact,
                    email: $scope.email,
                    phone: $scope.phone,
                    address: $scope.address
                },
            }).then(function(response) {
                $scope.loading--;
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
        $scope.showAccountDets = function(account) {
            $scope.accountDets = account;
        };
        $scope.rmAcct = function(acctId, acctName) {
            console.log("acct id to delete", acctId);
            var check = confirm(`are you sure you want to permenently Delete Acct: ${acctName}`);
            if (check) {
                console.log("make a delete request");
                $http({
                    method: 'DELETE',
                    url: `/accounts/${acctId}`
                }).then(function(response) {
                    console.log(`reload ${$scope.user.userName}'s accounts'`);
                    accountService.getMyAccountsServer($scope.user.repId);
                })
            } else {
                console.log(`${acctName} was not deleted`);
            }
        };
        $scope.newOrder = function(account) {
            $scope.orderAcct = account.accountName;
            $scope.orderAcctId = account._id;

            console.log("id for update order acct", $scope.orderAcctId);
            $scope.items = inventoryService.getMyInventoryServer($scope.user.distributer);
            console.log("beers for order list", $scope.items);
        }
        $scope.orderList = []
        $scope.orderTotal = 0;
        $scope.addToOrderList = function(orderBeer, beerQty, beerVessel) {
            var choicePrice = 0;
            if (beerVessel === 'cases') {
                choicePrice = orderBeer.priceCases;
            } else if (beerVessel === 'sixtels') {
                choicePrice = orderBeer.priceSixtel;
            } else {
                choicePrice = orderBeer.priceHB;
            }
            var beerTotal = beerQty * choicePrice;
            console.log("beer total", beerTotal);
            $scope.orderList.push({
                name: orderBeer.name,
                qty: beerQty,
                vessel: beerVessel,
                pricePerItem: choicePrice,
                totalBeerPrice: beerTotal
            })
            $scope.orderTotal = $scope.orderTotal + beerTotal;
            console.log("orderTotal", $scope.orderTotal);
        }
        $scope.placeOrder = function(acctName, orderList, repUser, dist, delivery) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = mm + '/' + dd + '/' + yyyy;

            var orderTotal = 0;
            console.log("acct id to update when order placed", $scope.orderAcctId);

            console.log("List of beers to order", orderList);
            orderList.forEach(function(el) {
                // find total price of beer order and add to orderTotal
                var beerTotal = el.qty * el.pricePerItem;
                console.log("beer total", beerTotal);
                orderTotal = orderTotal + beerTotal;
                // for each element of the order list, match the name and vessel type

                console.log('each beer to update', el.name);
                var matchBeer = {};
                var updateBeer = {};
                $http({
                    method: 'GET',
                    url: `/oneBeer/${el.name}`,

                }).then(function(response) {
                    console.log("one beer to match", response);
                    matchBeer = response.data[0];
                    console.log('matchBeer array', matchBeer);
                    if (el.vessel === 'cases') {
                        updateBeer = {
                            name: el.name,
                            qty: matchBeer.qtyCases - el.qty,
                            field: "qtyCases"
                        }
                    } else if (el.vessel === 'sixtels') {
                        updateBeer = {
                            name: el.name,
                            qty: matchBeer.qtySixtels - el.qty,
                            field: "qtySixtels"
                        }
                    } else {
                        updateBeer = {
                            name: el.name,
                            qty: matchBeer.qtyHalfBarrels - el.qty,
                            field: "qtyHalfBarrels"
                        }
                    }
                    console.log("send to server", updateBeer);

                    $http({
                        method: 'PUT',
                        url: '/inventory',
                        data: updateBeer
                    }).then(function(response) {
                        inventoryService.getMyInventoryServer();
                    })
                })

            });
            // Find the average order ammount and update the account
            var acctOrderList = [];
            $http({
                    method: 'GET',
                    url: '/orders'
                }).then(function(response) {
                    console.log("order list response", response);
                    console.log("account", acctName);
                    response.data.forEach(function(el) {
                        if (el.accountName === acctName) {
                            acctOrderList.push(el)
                        }
                    })
                    console.log("acctOrderList", acctOrderList);
                    console.log("total price of order", orderTotal);


                    var sumOfOrders = 0;

                    acctOrderList.forEach(function(el) {

                        console.log("price of each order", el.totalPrice);
                        sumOfOrders = sumOfOrders + el.totalPrice;
                    });
                    var divisor = acctOrderList.length + 1;
                    console.log("number to divide by", divisor);
                    console.log("number to divide", sumOfOrders);
                    var totalToDivide = sumOfOrders + orderTotal;
                    var averageOrder = Math.ceil(totalToDivide / divisor);
                    console.log("average order to update", averageOrder);
                    $http({
                        method: 'PUT',
                        url: `/accounts/${$scope.orderAcctId}`,
                        data: {
                            lastOrderDate: today,
                            avgOrderAmmnt: averageOrder
                        }
                    }).then(function(response) {
                        accountService.getMyAccountsServer($scope.user.repId);
                    })
                })
                // console.log("acctOrderList", acctOrderList);
                // console.log("total price of order", orderTotal);
                // debugger
                //
                // var sumOfOrders = 0;
                //
                // acctOrderList.forEach(function(el) {
                //
                //     console.log("price of each order", el.totalPrice);
                //     sumOfOrders = sumOfOrders + el.totalPrice;
                // });
                // var divisor = acctOrderList.length;
                // console.log("number to divide by", divisor);
                // console.log("number to divide", sumOfOrders);
                // var totalToDivide = sumOfOrders + orderTotal;
                // var averageOrder = totalToDivide / divisor;
                // console.log("average order to update", averageOrder);
            $http({
                method: 'PUT',
                url: `/accounts/${$scope.orderAcctId}`,
                data: {
                    lastOrderDate: today,

                }
            })
            $http({
                method: 'POST',
                url: '/orders',
                data: {
                    distributer: dist,
                    username: repUser,
                    accountName: acctName,
                    orderDate: today,
                    totalPrice: orderTotal,
                    beers: orderList,
                    deliveryDate: delivery,
                    delivered: false
                },
            }).then(function(response) {
                $scope.orderAcct = "";
                $scope.orderList = [];
                $scope.orderTotal = 0;
            })


        }

    }]);
};

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = function(app) {
    app.controller('ordersController', ['$scope', '$http', 'userService', 'orderService', function($scope, $http, userService, orderService){
      $scope.loading = 0;
      $scope.user = userService.getCurrentUser();
      $scope.allOrders = orderService.getAllOrders();
      $scope.notDelivOrders = orderService.getDistOrdersNotDeliv($scope.user.distributer);
      $scope.delivOrders = orderService.getDistOrdersDeliv($scope.user.distributer);

      $scope.delivered = function(id){
        $scope.loading ++;
        $http({
          method: 'PUT',
          url: `/orders/${id}`

        }).then(function(response){
          $scope.loading --;
          console.log("deliverd");
          orderService.getDistOrdersNotDeliv($scope.user.distributer);
          orderService.getDistOrdersDeliv($scope.user.distributer);
        })
      };

      $scope.showDetails = function(order){
        console.log("show details for", order);
        $scope.orderDets = order;
      }




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

},{"./controllers/accountsController":1,"./controllers/inventoryController":2,"./controllers/loginController":3,"./controllers/ordersController":4,"./controllers/welcomeController":5,"./services/accountService":7,"./services/inventoryService":8,"./services/orderService":9,"./services/userService":10}],7:[function(require,module,exports){
module.exports = function(app){


  app.factory('accountService',['$http', function($http){
    let accountList = [];
    let myAccountsList =[];
    let myAccountsServer = [];

    return{


      getMyAccounts: function(repID){
        let filteredAccounts = [];
        $http({
              method: 'GET',
              url: '/accounts',
          }).then(function(response) {
            console.log("all accounts", response);
            angular.copy(response.data, accountList);
            console.log("account list", accountList);
            accountList.forEach(function(el){
              if(el.repId === repID){
                filteredAccounts.push(el);
              }
            })
            angular.copy(filteredAccounts, myAccountsList);
          })
          console.log("filtered accounts", myAccountsList);
          return myAccountsList
      },

      getMyAccountsServer: function(repId) {
        $http({
            method: 'GET',
            url: `/repAccounts/${repId}`
        }).then(function(response){
          console.log('server side query results :', response );
          angular.copy(response.data, myAccountsServer);
        })
        return myAccountsServer;
      },

      deleteAccount: function(acctId) {
        $http({
          method:'DELETE',
          url:`/accounts/${acctId}`
        })

      }

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
    let inventory = [];
    let myInventoryList =[];
    let myInventoryServer = [];

    return{


      getMyInventory: function(distributer){
        $http({
              method: 'GET',
              url: '/inventory',
          }).then(function(response) {
            angular.copy(response.data, inventory);
            inventory.forEach(function(el){
              if(el.distributer === distributer){
                let sorted = [];
                sorted.push(el);
                angular.copy(sorted, myInventoryList);
              }
            })
          })
          return myInventoryList
      },
      getMyInventoryServer: function(dist) {
        $http({
            method: 'GET',
            url: `/distInventory/${dist}`,

        }).then(function(response){
          console.log('server side query results :', response );
          angular.copy(response.data, myInventoryServer);
        })
        return myInventoryServer;
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


app.factory('orderService',['$http', function($http){
 let allOrderList = [];
 let distributerOrderListNotDelivered = [];
 let myOrderList = [];
 let distributerOrderListDelivered= [];
 let acctOrderList = [];
 return {
   getAllOrders: function(){
     $http({
       method: 'GET',
       url: '/orders',

     }).then(function(response){

         angular.copy(response.data, allOrderList);

     });
     return allOrderList;
   },
   getDistOrdersNotDeliv: function(dist){
     console.log("not delivered", dist);
     $http({
       method: 'GET',
       url: `/ordersDistND/${dist}`,

     }).then(function(response){
       console.log("not delivered orders", response);
         angular.copy(response.data, distributerOrderListNotDelivered);

     });
     return  distributerOrderListNotDelivered;
   },
   getDistOrdersDeliv: function(dist){
     console.log("delivered distributer", dist);
     $http({
       method: 'GET',
       url: `/ordersDistD/${dist}`,


     }).then(function(response){
       console.log("deliverd orders",response);
         angular.copy(response.data, distributerOrderListDelivered);

     });
     return  distributerOrderListDelivered;
   },
   getMyOrders: function(username){
     currentMyOrders = [];
     allOrderList.forEach(function(el){
       if (el.username === username) {
         currentMyOrders.push(el);
       };
       angular.copy(currentMyOrders, myOrderList)
     });
     return myOrderList;
   },
   getAccountOrders: function(account){
     acctOrderList=[];
     $http({
       method: 'GET',
       url: '/orders'
     }).then(function(response){
       console.log("order list response", response);
       console.log("account", account);
       response.data.forEach(function(el){
         if (el.accountName === account) {
           acctOrderList.push(el)
         }
       })

     })
     console.log("acctOrderList",acctOrderList);
     return acctOrderList;
   }
 };


}]);
};

},{}],10:[function(require,module,exports){
module.exports = function(app){


  app.factory('userService',['$http', '$location', function($http, $location){

    let allUsers = [];
    let currentUser = {};

    return{
      login: function(user,pass) {
        $http({
              method: 'GET',
              url: '/users',
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