module.exports = function(app){


  app.factory('accountService',['$http', function($http){
    let accountList = [];
    let myAccountsList =[];
    let myAccountsServer = [];

    return{


      getMyAccounts: function(repID){
        let filteredAccounts = [];
        $http({
              method: 'GET',
              url: '/accounts',
          }).then(function(response) {
            console.log("all accounts", response);
            angular.copy(response.data, accountList);
            console.log("account list", accountList);
            accountList.forEach(function(el){
              if(el.repId === repID){
                filteredAccounts.push(el);
              }
            })
            angular.copy(filteredAccounts, myAccountsList);
          })
          console.log("filtered accounts", myAccountsList);
          return myAccountsList
      },

      getMyAccountsServer: function(repId) {
        $http({
            method: 'GET',
            url: `/repAccounts/${repId}`
        }).then(function(response){
          console.log('server side query results :', response );
          angular.copy(response.data, myAccountsServer);
        })
        return myAccountsServer;
      }
      // getPages: function(pageNum, perPage){
      //   console.log(eventList);
      //   let start = (pageNum - 1) * perPage;
      //   return eventList.slice(start, start + perPage)
      // },
    };
  }]);
};
