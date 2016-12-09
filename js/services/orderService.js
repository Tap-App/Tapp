module.exports = function(app){


app.factory('orderService',['$http', function($http){
 let allOrderList = [];
 let distributerOrderListNotDelivered = [];
 let myOrderList = [];
 let distributerOrderListDelivered= [];
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
       url: `/ordersDistND`,
       data: {distributer : dist, delivered: false}
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
       url: `/ordersDistD`,
       data: {distributer : dist, delivered: true}

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
 };


}]);
};
