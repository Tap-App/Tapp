module.exports = function(app){


app.factory('orderService',['$http', function($http){
 let allOrderList = [];
 let distributerOrderList = [];
 let myOrderList = [];

 return {
   getAllOrders: function(){
     $http({
       method: 'GET',
       url: 'Api/orders.json',

     }).then(function(response){

         angular.copy(response.data, allOrderList);

     });
     return allOrderList;
   },
   getDistOrders: function(distributer){
     console.log("All Order List inside getdistorders", allOrderList);
     allOrderList.forEach(function(el){
       if (el.distributer === distributer) {
         distributerOrderList.push(el);
       };
     });
     console.log("distributer order list to return", distributerOrderList);
     return distributerOrderList;
   },
   getMyOrders: function(username){
     allOrderList.forEach(function(el){
       if (el.username === username) {
         myOrderList.push(el);
       };
     });
     return myOrderList;
   },
 };


}]);
};
