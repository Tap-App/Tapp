module.exports = function(app){


  app.factory('accountService',['$http', function($http){
    let accountList = [];
    let myAccountsList =[];


    return{


      getMyAccounts: function(repID){
        $http({
              method: 'GET',
              url: '/Api/accounts.json',
          }).then(function(response) {
            console.log("my accounts", response);
            angular.copy(response.data, accountList);
            accountList.forEach(function(el){
              if(el.repID === repID){
                myAccountsList.push(el);
              }
            })
          })
          // console.log("allsongs arrar", allSongList);
          return myAccountsList
      },

      // getPages: function(pageNum, perPage){
      //   console.log(eventList);
      //   let start = (pageNum - 1) * perPage;
      //   return eventList.slice(start, start + perPage)
      // },
    };
  }]);
};
