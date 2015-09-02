'use strict';

(function() {
  angular.module('ncsaas')
    .service('baseEventListController', [
      'baseControllerListClass', 'eventsService', 'EVENTTYPE', baseEventListController]);

  function baseEventListController(baseControllerListClass, eventsService, EVENTTYPE) {
    var ControllerListClass = baseControllerListClass.extend({
      EVENTTYPE: EVENTTYPE,

      init:function() {
        this.service = eventsService;
        this.searchFieldName = 'search';
        this.searchFilters = [
          {
            name: 'event_type',
            title: 'Logged in',
            value: EVENTTYPE.auth_logged_in_with_username
          },
          {
            name: 'event_type',
            title: 'Project creation',
            value: EVENTTYPE.project_creation_succeeded
          },
          {
            name: 'event_type',
            title: 'Organization creation',
            value: EVENTTYPE.customer_creation_succeeded
          }
        ];
        this._super();
      }
    });

    return ControllerListClass;
  }

  angular.module('ncsaas')
    .controller('EventListController', [
      '$scope',
      'baseEventListController',
      'currentStateService',
      'ENV',
      EventListController]);

  function EventListController(
    $scope,
    baseEventListController,
    currentStateService,
    ENV) {
    var controllerScope = this;
    var EventController = baseEventListController.extend({
      init:function() {
        this.controllerScope = controllerScope;
        this.cacheTime = ENV.dashboardEventsCacheTime;
        this._super();

        $scope.$on('currentCustomerUpdated', this.onCustomerUpdate.bind(this));
      },

      onCustomerUpdate: function() {
        this.getList();
      },

      getList: function(filter) {
        var vm = this;
        var fn = this._super.bind(vm);
        filter = filter || {};
        return currentStateService.getCustomer().then(function(customer) {
          filter['scope'] = customer.url;
          vm.service.defaultFilter.scope = customer.url;
          fn(filter);
        });
      }
    });

    controllerScope.__proto__ = new EventController();
  }

  angular.module('ncsaas')
    .controller('CustomerAlertsListController', [
      '$scope',
      'baseControllerListClass',
      'currentStateService',
      'alertsService',
      'ENTITYLISTFIELDTYPES',
      CustomerAlertsListController]);

  function CustomerAlertsListController(
    $scope,
    baseControllerListClass,
    currentStateService,
    alertsService,
    ENTITYLISTFIELDTYPES) {
    var controllerScope = this;
    var controllerClass = baseControllerListClass.extend({
      init: function() {
        this.controllerScope = controllerScope;
        this.service = alertsService;
        this._super();

        this.entityOptions = {
          entityData: {
            noDataText: 'No alerts yet'
          },
          list: [
            {
              name: 'Message',
              propertyName: 'message',
              type: ENTITYLISTFIELDTYPES.noType
            }
          ]
        };

        $scope.$on('currentCustomerUpdated', this.onCustomerUpdate.bind(this));
      },

      onCustomerUpdate: function() {
        this.getList();
      },

      getList: function(filter) {
        var vm = this;
        var fn = this._super.bind(vm);
        filter = filter || {};
        return currentStateService.getCustomer().then(function(customer) {
          vm.service.defaultFilter.aggregate = 'customer';
          vm.service.defaultFilter.uuid = customer.uuid;
          fn(filter);
        })
      }
    });

    controllerScope.__proto__ = new controllerClass();
  }

  angular.module('ncsaas')
    .controller('DashboardIndexController', ['$scope', '$stateParams', DashboardIndexController]);

    function DashboardIndexController($scope, $stateParams) {
      $scope.activeTab = $stateParams.tab || 'activity';
    }

  angular.module('ncsaas')
    .controller('DashboardCostController', [
      '$scope',
      'baseControllerClass',
      'priceEstimationService',
      'blockUI',
      DashboardCostController]);

  function DashboardCostController(
    $scope,
    baseControllerClass,
    priceEstimationService,
    blockUI) {
    var controllerScope = this;
    var EventController = baseControllerClass.extend({
      init: function() {
        this.controllerScope = controllerScope;

        $scope.$on('currentCustomerUpdated', this.onCustomerUpdate.bind(this));
        this.onCustomerUpdate();
        blockUI.start();
      },

      onCustomerUpdate: function() {
        var vm = this;
        priceEstimationService.pageSize = 1000;
        priceEstimationService.getList().then(function(rows) {
          vm.processChartData(rows);
          vm.processTableData(rows);
        });
      },

      processChartData: function(rows) {
        var labels = [];
        var totals = [];
        rows.forEach(function(row) {
          if (row.scope_type == 'customer') {
            labels.unshift(moment(row.month, 'MM').format('MMMM'));
            totals.unshift(row.total);
          }
        });
        blockUI.stop();

        this.chartOptions = {
          bezierCurve: false,
          responsive: true,
          animationEasing: "linear"
        };

        this.costData = {
          labels: labels,
          datasets: [
            {
              fillColor: "rgba(123, 166, 196,0.5)",
              strokeColor: "rgba(123, 166, 196,1)",
              pointColor: "rgba(123, 166, 196,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(123, 166, 196,1)",
              data: totals
            }
          ]
        };
      },

      processTableData: function(rows) {
        var results = {};
        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var date = moment(row.month, 'MM').format('MMMM') + ' ' + row.year;
          if (!results.hasOwnProperty(date)) {
            results[date] = {
              total: 0,
              projects: [],
              services: [],
              resources: []
            }
          }
          if (row.scope_type == 'customer') {
            results[date].total = row.total;
          }
          if (row.scope_type == 'project') {
            results[date].projects.push(row);
          }
          if (row.scope_type == 'resource') {
            results[date].resources.push(row);
          }
          if (row.scope_type == 'service') {
            results[date].services.push(row);
          }
          if (row.scope_type == 'serviceprojectlink') {
            results[date].services.push(row);
          }
        }
        var table = [];
        for (var date in results) {
          var row = results[date];
          table.push({
            date: date,
            total: row.total,
            projects: row.projects,
            services: row.services,
            resources: row.resources
          });
        }
        if (table.length > 0) {
          table[0].selected = true;
          table[0].activeTab = 'services';
        }
        this.table = table;
      }
    });

    controllerScope.__proto__ = new EventController();
  }


  angular.module('ncsaas')
    .controller('DashboardActivityController', [
      '$scope',
      'baseControllerClass',
      'projectsService',
      'alertsService',
      'eventsService',
      'eventStatisticsService',
      'resourcesCountService',
      'currentStateService',
      'ENV',
      '$window',
      DashboardActivityController]);

  function DashboardActivityController(
    $scope,
    baseControllerClass,
    projectsService,
    alertsService,
    eventsService,
    eventStatisticsService,
    resourcesCountService,
    currentStateService,
    ENV,
    $window) {
    var controllerScope = this;
    var EventController = baseControllerClass.extend({
      showGraph: true,
      init:function() {
        this.controllerScope = controllerScope;
        this.cacheTime = ENV.dashboardEventsCacheTime;
        this.setSignalHandler('refreshCounts', this.afterActivate.bind(controllerScope));
        this._super();
        this.activeTab = 'activity';
        this.chartOptions = {
          responsive: true,
          scaleShowVerticalLines: false,
          scaleShowGridLines: false,
          bezierCurve: false
        };

        $scope.$on('currentCustomerUpdated', this.onCustomerUpdate.bind(this));
        this.onCustomerUpdate();
        this.resizeControl();
      },
      resizeControl: function() {
        var vm = this;

        var window = angular.element($window);
        window.bind('resize', function () {
          vm.showGraph = false;
          setTimeout(function() {
            vm.showGraph = true;
            $scope.$apply();
          }, 0);
          $scope.$apply();
        });
      },
      selectProject: function (project) {
        if (project) {
          project.selected =! project.selected;
          this.getProjectResources(project);
          this.getProjectEvents(project);
        }
      },
      onCustomerUpdate: function() {
        this.getCustomerProjects();
        this.getCustomerEvents();
        this.getCustomerAlerts();
      },
      getCustomerAlerts: function () {
        var vm = this;
        currentStateService.getCustomer().then(function(customer) {
          alertsService.getList({'aggregate': 'customer', 'uuid': customer.uuid}).then(function(response) {
            vm.alerts = response;
          })
        })
      },
      getCustomerEvents: function () {
        var vm = this;
        currentStateService.getCustomer().then(function(customer) {
          eventsService.getList({'scope': customer.url}).then(function(response) {
            vm.events = response;
          })
        })
      },
      getCustomerProjects: function() {
        var vm = this;
        projectsService.getList().then(function(response) {
          vm.projects = response;
          for (var i = 0; i < vm.projects.length; i++) {
            vm.projects[i].selected = false;
          }
          vm.selectProject(vm.projects[0]);
        });
      },
      getProjectResources: function (project) {
        if (project.count) {
          return;
        }
        project.count = {};
        project.count.services = project.services.length;
        priceEstimationServiceountService.users({'project': project.uuid}).then(function(count) {
          project.count.users = count;
        });
        resourcesCountService.resources({
          'project_uuid': project.uuid,
          'resource_type': ENV.resourceFilters.VMs
        }).then(function(count) {
          project.count.resources = count;
        });
        resourcesCountService.alerts({'scope': project.url}).then(function(count) {
          project.count.alerts = count;
        });
      },
      getProjectEvents: function (project) {
        if (project.chartData) {
          return;
        }
        var end = moment.utc().unix();
        var count = 7;
        var start = moment.utc().subtract(count + 1, 'days').unix();
        eventStatisticsService.getList({
          'scope': project.url,
          'start': start,
          'end': end,
          'points_count': count + 1
        }).then(function(response) {
          var labels = [];
          var total = [];
          for (var i = 0; i < response.length; i++) {
            var date = moment.unix(response[i].point);
            var day = date.format('dddd');
            var value = response[i].object.count;
            labels.push(day);
            total.push(value);
          }

          var points = [];
          for (var i = 1; i < total.length; i++) {
            points[i] = total[i] - total[i-1];
          }
          labels.shift();
          points.shift();

          project.chartData = {
            labels: labels,
            datasets: [
              {
                label: "Events",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: points
              }
            ]
          };
        })
      }
    });

    controllerScope.__proto__ = new EventController();
  }
})();
