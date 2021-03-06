import template from './billing-record-details.html';
import './billing-record-details.css';

const billingRecordDetails = {
  template,
  bindings: {
    invoice: '<'
  },
  controller: class BillingRecordDetailsController {
    // @ngInject
    constructor(BillingUtils, currentStateService) {
      this.BillingUtils = BillingUtils;
      this.currentStateService = currentStateService;
    }

    $onInit() {
      this.projects = this.BillingUtils.groupInvoiceItems(this.invoice.items);
      this.currentStateService.getCustomer().then(customer => {
        this.customer = customer;
      }
      );
    }
  }
};

export default billingRecordDetails;
