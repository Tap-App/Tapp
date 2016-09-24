module.exports = function(app){


  app.factory('inventoryService',['$http', function($http){
    let inventory = [];
    let myInventoryList =[];


    return{


      getMyInventory: function(distributer){
        $http({
              method: 'GET',
              url: '/Api/inventory.json',
          }).then(function(response) {
            console.log("my inventory", response);
            angular.copy(response.data, inventory);
            inventory.forEach(function(el){
              if(el.distributer === distributer){
                myInventoryList.push(el);
              }
            })
          })
          // console.log("allsongs arrar", allSongList);
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
