import template from './openstack-instance-checkout-summary.html';

// @ngInject
class SummaryController {
  constructor(OpenStackSummaryService, currentStateService, coreUtils, $q, $scope) {
    this.OpenStackSummaryService = OpenStackSummaryService;
    this.currentStateService = currentStateService;
    this.coreUtils = coreUtils;
    this.$q = $q;
    this.$scope = $scope;
  }

  $onInit() {
    this.loading = true;
    this.components = {};
    this.quotas = [];
    this.$q.all([this.loadProject(), this.loadQuotas()])
      .then(() => this.setupWatchers())
      .finally(() => this.loading = false);
  }

  loadProject() {
    return this.currentStateService.getProject()
      .then(project => this.project = project);
  }

  loadQuotas() {
    return this.OpenStackSummaryService.getServiceComponents(this.model.service)
      .then(result => {
        this.components = result.components;
        this.usages = result.usages;
        this.limits = result.limits;
      });
  }

  setupWatchers() {
    this.componentsMessage =
      this.coreUtils.templateFormatter(
        gettext('Note that this virtual machine is charged as part of <strong>{serviceName}</strong> package.'),
        { serviceName: this.model.service.name });

    this.$scope.$watch(() => this.model, () => this.updateQuotas(), true);
    this.updateQuotas();
  }

  updateQuotas() {
    this.quotas = [
      {
        name: 'ram',
        usage: this.usages.ram,
        limit: this.limits.ram,
        required: this.model.flavor ? this.model.flavor.ram : 0
      },
      {
        name: 'vcpu',
        usage: this.usages.cores,
        limit: this.limits.cores,
        required: this.model.flavor ? this.model.flavor.cores : 0
      },
      {
        name: 'storage',
        usage: this.usages.disk,
        limit: this.limits.disk,
        required: this.getTotalStorage() || 0
      },
      {
        name: 'cost',
        usage: this.project.billing_price_estimate.total,
        limit: this.project.billing_price_estimate.limit,
        required: this.getMonthlyPrice()
      }
    ];
  }

  isValid() {
    return this.getDailyPrice();
  }

  getDailyPrice() {
    if (this.components && this.model.flavor) {
      return this.model.flavor.cores * this.components.cores +
             this.model.flavor.ram * this.components.ram +
             this.getTotalStorage() * this.components.disk;
    } else {
      return 0;
    }
  }

  getMonthlyPrice() {
    return this.getDailyPrice() * 30;
  }

  getTotalStorage() {
    return this.model.system_volume_size + (this.model.data_volume_size || 0);
  }
}

const openstackInstanceCheckoutSummary = {
  template: template,
  controller: SummaryController,
  bindings: {
    model: '<'
  }
};

export default openstackInstanceCheckoutSummary;
