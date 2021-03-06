const openstackVolumesList = {
  controller: VolumesListController,
  controllerAs: 'ListController',
  templateUrl: 'views/partials/filtered-list.html',
  bindings: {
    onListReceive: '&',
  }
};

export default openstackVolumesList;

// @ngInject
function VolumesListController(
  BaseProjectResourcesTabController,
  ncUtils,
  $state,
  $scope,
  $timeout,
  $filter,
  ENV,
  TableExtensionService,
  features) {
  var controllerScope = this;
  var ResourceController = BaseProjectResourcesTabController.extend({
    init:function() {
      this.category = ENV.Storages;
      this.controllerScope = controllerScope;
      this._super();
      this.addRowFields(['size', 'instance', 'instance_name']);
      $scope.$on('refreshVolumesList', function() {
        $timeout(function() {
          controllerScope.resetCache();
        });
      });
    },
    getFilter: function() {
      return {
        resource_type: 'OpenStackTenant.Volume'
      };
    },
    getTableOptions: function() {
      var options = this._super();
      options.noDataText = gettext('You have no volumes yet.');
      options.noMatchesText = gettext('No volumes found matching filter.');
      options.tableActions = this.getTableActions();
      options.columns.push({
        title: gettext('Size'),
        className: 'all',
        orderField: 'size',
        render: function(row) {
          if (!row.size) {
            return '&ndash;';
          }
          return $filter('filesize')(row.size);
        }
      });
      options.columns.push({
        title: gettext('Attached to'),
        className: 'min-tablet-l',
        orderField: 'instance_name',
        render: function(row) {
          if (!row.instance) {
            return '&ndash;';
          }
          var uuid = ncUtils.getUUID(row.instance);
          var href = $state.href('resources.details', {
            uuid: uuid,
            resource_type: 'OpenStackTenant.Instance'
          });
          return ncUtils.renderLink(href, row.instance_name || 'OpenStack instance');
        }
      });
      return options;
    },
    getTableActions: function() {
      let actions = TableExtensionService.getTableActions('openstack-volumes-list');
      if (this.category !== undefined) {
        actions.push(this.getCreateAction());
      }
      if (features.isVisible('openMap')) {
        actions.push(this.getMapAction());
      }
      return actions;
    },
    getCreateTitle: function() {
      return gettext('Add volumes');
    }
  });
  controllerScope.__proto__ = new ResourceController();
}
