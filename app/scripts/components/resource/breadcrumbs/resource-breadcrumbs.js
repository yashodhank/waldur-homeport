export const resourceBreadcrumbs = {
  template: '<breadcrumbs items="$ctrl.items" active-item="$ctrl.activeItem"/>',
  bindings: {
    resource: '<'
  },
  controller: class ResourceBreadcrumbsController {
    constructor(ResourceBreadcrumbsService) {
      this.ResourceBreadcrumbsService = ResourceBreadcrumbsService;
    }

    $onInit() {
      this.items = [
        {
          label: gettext('Project workspace'),
          state: 'project.details',
          params: {
            uuid: this.resource.project_uuid
          }
        },
        {
          label: gettext('Resources'),
        },
        ...this.ResourceBreadcrumbsService.get(this.resource),
      ];

      this.activeItem = this.resource.name;
    }

    $doCheck() {
      if (this.activeItem !== this.resource.name) {
        this.activeItem = this.resource.name;
      }
    }
  }
};
