(function() {
  angular.module('ncsaas').config(function($stateProvider) {
    $stateProvider
      .state('organization', {
          url: '/organizations/:uuid/',
          abstract: true,
          data: {
            auth: true
          },
          templateUrl: 'views/customer/base.html',
          resolve: {
            currentCustomer: function(
              $stateParams, $state, $rootScope, customersService, currentStateService) {
              if (!$stateParams.uuid) {
                return currentStateService.getCustomer();
              }
              return customersService.$get($stateParams.uuid).then(function(customer) {
                $rootScope.$broadcast('adjustCurrentCustomer', customer);
                return customer;
              }, function(error) {
                if (error.status == 404) {
                  $state.go('errorPage.notFound');
                }
              });
            }
          }
        })

      .state('organization.details', {
        url: '',
        template: '<responsive-table table-ctrl="ListController"/>',
        controller: 'CustomerEventTabController',
        controllerAs: 'ListController',
        data: {
          pageTitle: 'Audit logs'
        }
      })

      .state('organization.alerts', {
        url: 'alerts/',
        template: '<responsive-table table-ctrl="ListController"/>',
        controller: 'CustomerAlertsListController',
        controllerAs: 'ListController',
        data: {
          pageTitle: 'Alerts'
        }
      })

      .state('organization.projects', {
        url: 'projects/',
        template: '<responsive-table table-ctrl="ListController"/>',
        controller: 'CustomerProjectTabController',
        controllerAs: 'ListController',
        data: {
          pageTitle: 'Projects'
        }
      })

      .state('organization.team', {
        url: 'team/',
        templateUrl: 'views/partials/list.html',
        controller: 'CustomerTeamTabController',
        controllerAs: 'Ctrl',
        data: {
          pageTitle: 'Team'
        }
      })

      .state('organization.providers', {
        url: 'providers/?providerUuid&providerType',
        template: '<responsive-table table-ctrl="ListController"/>',
        controller: 'ProviderListController',
        controllerAs: 'ListController',
        data: {
          pageTitle: 'Providers'
        }
      })

      .state('organization.billing', {
        url: 'billing/',
        templateUrl: 'views/customer/tab-billing.html',
        data: {
          pageTitle: 'Billing'
        }
      })

      .state('organization.sizing', {
        url: 'sizing/',
        templateUrl: 'views/customer/tab-sizing.html',
        data: {
          pageTitle: 'Sizing'
        }
      })

      .state('organization.delete', {
        url: 'delete/',
        templateUrl: 'views/customer/tab-delete.html',
        controller: 'CustomerDeleteTabController',
        controllerAs: 'DeleteController',
        data: {
          pageTitle: 'Delete organization'
        }
      })

      .state('organization.plans', {
        url: 'plans/',
        templateUrl: 'views/customer/plans.html',
        data: {
          pageTitle: 'Plans'
        }
      })

      .state('organization.analysis', {
        url: '',
        abstract: true,
        template: '<ui-view/>'
      })

      .state('organization.analysis.cost', {
        url: 'cost-analysis/',
        templateUrl: 'views/dashboard/cost-tab.html',
        data: {
          pageTitle: 'Cost analysis'
        }
      })

      .state('organization.analysis.resources', {
        url: 'resource-usage/',
        templateUrl: 'views/dashboard/resources-tab.html',
        data: {
          pageTitle: 'Resource usage'
        }
      })

      .state('services', {
        url: '/services/',
        abstract: true,
        templateUrl: 'views/customer/base.html',
        data: {
          auth: true
        }
      })

      .state('services.create', {
        url: 'add/',
        templateUrl: 'views/service/create.html',
        controller: 'ServiceAddController',
        controllerAs: 'ServiceAdd',
        data: {
          pageTitle: 'Create provider'
        }
      })
  });
})();