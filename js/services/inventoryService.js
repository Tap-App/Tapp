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
            url: `/distInventory`,
            data: {distributer: dist}
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
