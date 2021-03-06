import slurmRoutes from './routes';
import actionConfig from './actions';
import slurmAllocationConfig from './slurm-allocation-config';
import registerSidebarExtension from './sidebar';
import registerProjectsListExtension from './projects-list-extension';
import SlurmAllocationService from './slurm-allocation-service';
import SlurmPackagesService from './slurm-packages-service';
import slurmAllocationList from './slurm-allocation-list';
import slurmAllocationSummary from './slurm-allocation-summary';
import slurmAllocationCheckoutSummary from './slurm-allocation-checkout-summary';

export default module => {
  module.config(slurmRoutes);
  module.config(actionConfig);
  module.config(slurmAllocationConfig);
  module.run(registerSidebarExtension);
  module.run(registerProjectsListExtension);
  module.service('SlurmAllocationService', SlurmAllocationService);
  module.service('SlurmPackagesService', SlurmPackagesService);
  module.component('slurmAllocationList', slurmAllocationList);
  module.component('slurmAllocationSummary', slurmAllocationSummary);
  module.component('slurmAllocationCheckoutSummary', slurmAllocationCheckoutSummary);
};
