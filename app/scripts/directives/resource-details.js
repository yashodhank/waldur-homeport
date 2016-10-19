'use strict';

(function() {
  angular.module('ncsaas')
    .directive('resourceDetails', [
      'resourceUtils', 'ncUtils', 'currentStateService', resourceDetails]);

  function resourceDetails(resourceUtils, ncUtils, currentStateService) {
    return {
      restrict: 'E',
      scope: {
        'resource': '='
      },
      templateUrl: 'views/directives/resource-details.html',
      link: function(scope) {
        scope.$watch('resource', function() {
          var resource = scope.resource;
          if (resource) {
            resourceUtils.setAccessInfo(resource);
            resource.service_type = resource.resource_type.split('.')[0];
            resource.customer_uuid = currentStateService.getCustomerUuid();
            resource.summary = resourceUtils.getSummary(resource);
            scope.formatted_resource_type = resourceUtils.formatResourceType(resource);
            scope.state_class = resourceUtils.getStateClass(resource);
            resource.uptime = resourceUtils.getUptime(resource);

            if (resource.instance) {
              resource.instance_uuid = ncUtils.getUUID(resource.instance);
            }

            if (resource.source_volume) {
              resource.source_volume_uuid = ncUtils.getUUID(resource.source_volume);
            }
          }
        });
      }
    };
  }
})();
