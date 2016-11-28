module.exports = function(app){


app.factory('orderService',['$http', function($http){
 let allOrderList = [];
 let distributerOrderList = [];
 let myOrderList = [];

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
   getDistOrders: function(distributer){
     currentDistOrders = [];
     console.log("All Order List inside getdistorders", allOrderList);
     allOrderList.forEach(function(el){
       if (el.distributer === distributer) {
         currentDistOrders.push(el);
       };
       angular.copy(currentDistOrders, distributerOrderList)
     });
     console.log("distributer order list to return", distributerOrderList);
     return distributerOrderList;
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
