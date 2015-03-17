'use strict';

(function() {
  angular.module('ncsaas')
    .controller('ProfileController',
      ['$rootScope', 'usersService', 'customersService', 'projectsService', ProfileController]);

  function ProfileController($rootScope, usersService, customersService, projectsService) {
    var vm = this;

    vm.activeTab = 'eventlog';

    vm.user = usersService.getCurrentUserWithKeys();
    vm.customers = customersService.getCustomersList();
    vm.projects = projectsService.getProjectList();

  }

})();