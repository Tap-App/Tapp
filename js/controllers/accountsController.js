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
        };
        $scope.cancelEditContact = function() {
                $scope.editContact = false;
            };
            // show and hide edit phone input
        $scope.showPhone = function() {
            $scope.editPhone = true;
        };
        $scope.cancelEditPhone = function() {
                $scope.editPhone = false;
            };
        $scope.showEmail = function() {
                $scope.editEmail = true;
            };
        $scope.cancelEditPhone = function() {
                $scope.editEmail = false;
              };
            // show and hide edit address input
        $scope.showAddress = function() {
            $scope.editAddress = true;
        };
        $scope.cancelEditAddress = function() {
            $scope.editAddress = false;
        };
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
        $scope.orderDeposit= 0;
        $scope.totalOrderKegs = 0;
        $scope.orderTotal = 0;
        $scope.orderTotalDeposit = 0;
        $scope.addToOrderList = function(orderBeer, beerQty, beerVessel) {
            var orderBeerKegs = 0;
            var choicePrice = 0;
            if (beerVessel === 'cases') {
                choicePrice = orderBeer.priceCases;
            } else if (beerVessel === 'sixtels') {
                choicePrice = orderBeer.priceSixtel;
                orderBeerKegs = 1;
            } else if (beerVessel === 'halfBarrels'){
                choicePrice = orderBeer.priceHB;
                orderBeerKegs = 1;
            } else if (beerVessel === 'quarterBarrels'){
              choicePrice = orderBeer.priceQB;
              orderBeerKegs = 1;
            }
            var beerTotal = beerQty * choicePrice;
            var kegTotal = beerQty * orderBeerKegs;
            var kegCost = kegTotal * 40;
            var priceWithDeposit = beerTotal + kegCost;
            console.log("beer total", beerTotal);
            console.log("total kegs", kegTotal);
            console.log("keg cost", kegCost);
            console.log("total price", priceWithDeposit);
            $scope.orderList.push({
                name: orderBeer.name,
                qty: beerQty,
                vessel: beerVessel,
                pricePerItem: choicePrice,
                totalBeerPrice: beerTotal,
                numberOfKegs: kegTotal,
                kegDeposit: kegCost,
                totalWithDeposit: priceWithDeposit,
            })
            $scope.orderTotal = $scope.orderTotal + beerTotal;
            $scope.totalOrderKegs = $scope.totalOrderKegs + kegTotal;
            $scope.orderDeposit = $scope.orderDeposit + kegCost;
            $scope.orderTotalDeposit = $scope.orderTotalDeposit + priceWithDeposit;
            console.log("orderTotal", $scope.orderTotal);
            console.log("order List: ", $scope.orderList);
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
                    repName: $scope.user.name,
                    accountName: acctName,
                    orderDate: today,
                    totalBeerPrice: orderTotal,
                    totalKegs: $scope.totalOrderKegs,
                    totalPriceWitDeposit: $scope.orderTotalDeposit,
                    totalDeposit: $scope.orderDeposit,
                    beers: orderList,
                    deliveryDate: delivery,
                    delivered: false
                },
            }).then(function(response) {
                $scope.orderAcct = "";
                $scope.orderList = [];
                $scope.orderTotal = 0;
                $scope.totalOrderKegs = 0;
                $scope.orderTotalDeposit = 0;
                $scope.orderDeposit = 0;
            })


        }

    }]);
};
