// @ngInject
export default function openstackSecurityGroupsService(baseServiceClass) {
  var ServiceClass = baseServiceClass.extend({
    init: function() {
      this._super();
      this.endpoint = '/openstack-security-groups/';
    }
  });
  return new ServiceClass();
}
