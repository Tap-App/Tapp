module.exports = function(app){


  app.factory('inventoryService',['$http', function($http){
    let inventory = [];
    let myInventoryList =[];


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

      // getPages: function(pageNum, perPage){
      //   console.log(eventList);
      //   let start = (pageNum - 1) * perPage;
      //   return eventList.slice(start, start + perPage)
      // },
    };
  }]);
};
