import { ISSUE_ICONS, ISSUE_TEXT_CLASSES } from './constants';

const issueList = {
  templateUrl: 'views/partials/filtered-list.html',
  controllerAs: 'ListController',
  controller: IssueListController,
  bindings: {
    filter: '<',
    options: '<'
  }
};

export default issueList;

// @ngInject
function IssueListController(
    baseControllerListClass, usersService, issuesService, $filter, $scope, $rootScope, $state, ncUtils) {
  var controllerScope = this;
  var controllerClass = baseControllerListClass.extend({
    init: function() {
      this.service = issuesService;
      this.controllerScope = controllerScope;

      const fn = this._super.bind(this);
      usersService.getCurrentUser().then(user => {
        this.supportOrStaff = user.is_staff || user.is_support;
        this.tableOptions = angular.extend({
          disableAutoUpdate: true,
          disableSearch: true,
          enableOrdering: true,
          searchFieldName: 'summary',
          noDataText: gettext('No support requests yet.'),
          noMatchesText: gettext('No support requests found matching filter.'),
          columns: this.getColumns()
        }, controllerScope.options || {});
        this.connectWatchers();
        fn();
      });
    },
    getColumns: function() {
      return [
        {
          id: 'key',
          title: gettext('Key'),
          orderField: 'key',
          render: function(row) {
            const href = $state.href('support.detail', {uuid: row.uuid});
            return ncUtils.renderLink(href, row.key || 'N/A');
          },
          width: 100
        },
        {
          id: 'status',
          title: gettext('Status'),
          orderField: 'status',
          render: function(row) {
            const type = row.type.toUpperCase().replace(' ', '_');
            const iconClass = ISSUE_ICONS[type];
            const textClass = ISSUE_TEXT_CLASSES[type];
            const title = $filter('translate')(row.type).toUpperCase();
            const status = row.status || 'N/A';
            return `<i class="fa ${iconClass} ${textClass}" uib-tooltip="${title}"></i> ${status}`;
          },
          width: 50
        },
        {
          id: 'title',
          title: gettext('Title'),
          orderField: 'summary',
          render: function(row) {
            return `<span class="elipsis" style="width: 150px;" uib-tooltip="${row.summary}">${row.summary}</span>`;
          }
        },
        {
          id: 'description',
          title: gettext('Description'),
          orderable: false,
          render: function(row) {
            return `<span class="elipsis" style="width: 150px;" uib-tooltip="${row.description}">${row.description}</span>`;
          }
        },
        {
          id: 'resource_type',
          title: gettext('Service type'),
          orderable: false,
          isVisible: () => this.supportOrStaff,
          render: function(row) {
            return row.resource_type || 'N/A';
          }
        },
        {
          id: 'customer',
          title: gettext('Organization'),
          orderField: 'customer_name',
          render: function(row) {
            return row.customer_name || 'N/A';
          }
        },
        {
          id: 'caller',
          title: gettext('Caller'),
          orderField: 'caller_full_name',
          render: function(row) {
            return row.caller_full_name || 'N/A';
          },
          width: 170
        },
        {
          id: 'reporter',
          title: gettext('Reporter'),
          orderField: 'reporter_name',
          render: function(row) {
            return row.reporter_name || 'N/A';
          },
          isVisible: () => this.supportOrStaff,
          width: 170
        },
        {
          id: 'assignee',
          title: gettext('Assigned to'),
          orderField: 'assignee_name',
          render: function(row) {
            return row.assignee_name || 'N/A';
          },
          isVisible: () => this.supportOrStaff,
          width: 170
        },
        {
          id: 'created',
          title: gettext('Created'),
          orderField: 'created',
          render: function(row) {
            return $filter('shortDate')(row.created);
          },
          width: 130
        },
        {
          id: 'in_progress',
          title: gettext('Time in progress'),
          orderable: false,
          render: function(row) {
            return ncUtils.relativeDate(row.created);
          },
          isVisible: () => this.supportOrStaff,
          width: 100
        }
      ];
    },
    connectWatchers: function() {
      $scope.$watch(() => controllerScope.filter, () => {
        controllerScope.getList();
      }, true);
      var unbind = $rootScope.$on('refreshIssuesList', () => {
        this.service.clearAllCacheForCurrentEndpoint();
        controllerScope.getList();
      });
      $scope.$on('$destroy', () => {
        unbind();
      });
    },
    getFilter: function() {
      return controllerScope.filter;
    }
  });

  controllerScope.__proto__ = new controllerClass();
}
