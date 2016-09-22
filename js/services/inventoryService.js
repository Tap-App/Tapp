module.exports = function(app){


  app.factory('inventoryService',['$http', function($http){

    let myInventory =[];


    return{


      getMyAccounts: function(distributer){
        $http({
              method: 'GET',
              url: '/Api/inventory.json',
          }).then(function(response) {
            console.log("my inventory", response);
            angular.copy(response.data, inventory);
            inventory.forEach(function(el){
              if(el.distributer === distributer){
                myAccountList.push(el);
              }
            })
          })
          // console.log("allsongs arrar", allSongList);
          return myInventory
      },

      // getPages: function(pageNum, perPage){
      //   console.log(eventList);
      //   let start = (pageNum - 1) * perPage;
      //   return eventList.slice(start, start + perPage)
      // },
    };
  }]);
};
