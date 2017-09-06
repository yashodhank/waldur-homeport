import paypalInvoiceDetails from './paypal-invoice-details';
import paypalInvoiceState from './paypal-invoice-state';
import paypalInvoicesList from './paypal-invoices-list';
import paypalInvoicesService from './paypal-invoices-service';
import paypalInvoiceActions from './paypal-invoice-actions';

export default module => {
  module.service('paypalInvoicesService', paypalInvoicesService);
  module.component('paypalInvoiceActions', paypalInvoiceActions);
  module.component('paypalInvoiceState', paypalInvoiceState);
  module.component('paypalInvoicesList', paypalInvoicesList);
  module.component('paypalInvoiceDetails', paypalInvoiceDetails);
};
