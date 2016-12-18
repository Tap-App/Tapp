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
