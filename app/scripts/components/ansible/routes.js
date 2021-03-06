import { APPSTORE_CATEGORY } from './constants';

// @ngInject
export default function ansibleRoutes($stateProvider) {
  $stateProvider
    .state('appstore.ansible', {
      url: 'applications/:category/',
      template: '<ansible-job-create/>',
      data: {
        category: APPSTORE_CATEGORY,
        pageTitle: gettext('Applications'),
        sidebarState: 'project.resources',
        feature: 'ansible'
      }
    })

    .state('project.resources.ansible', {
      url: 'applications/',
      template: '<ui-view/>',
      abstract: true,
    })

    .state('project.resources.ansible.list', {
      url: '',
      template: '<ansible-jobs-list/>',
      data: {
        pageTitle: gettext('Applications'),
        feature: 'ansible'
      }
    })

    .state('project.resources.ansible.details', {
      url: ':jobId/',
      template: '<ansible-job-details/>',
      data: {
        pageTitle: gettext('Application details'),
        pageClass: 'gray-bg',
        feature: 'ansible',
      }
    });
}
