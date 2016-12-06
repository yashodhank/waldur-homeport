import OpenStackSummaryService from './openstack-summary-service';
import openstackTenantModule from './openstack-tenant/module';
import openstackInstanceModule from './openstack-instance/module';
import openstackVolumeModule from './openstack-volume/module';

export default module => {
  module.service('OpenStackSummaryService', OpenStackSummaryService);
  openstackTenantModule(module);
  openstackInstanceModule(module);
  openstackVolumeModule(module);
};