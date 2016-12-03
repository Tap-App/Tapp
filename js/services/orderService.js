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
     $http({
       method: 'GET',
       url: '/ordersDist',

     }).then(function(response){

         angular.copy(response.data, distributerOrderList);

     });
     return  distributerOrderList;
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
