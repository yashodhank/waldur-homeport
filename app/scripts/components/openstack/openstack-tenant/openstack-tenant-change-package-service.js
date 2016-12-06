import { templateParser } from './openstack-template';

// @ngInject
export default class openstackTenantChangePackageService {
  // Public API consists of two methods: 
  // * loadData - returns promise with fields {package, template, templates}
  // * saveData - accepts dictionary with fields {tenant, package, template, newTemplate}

  constructor($q, packageTemplatesService, openstackPackagesService, issuesService) {
    this.$q = $q;
    this.packageTemplatesService = packageTemplatesService;
    this.openstackPackagesService = openstackPackagesService;
    this.issuesService = issuesService;
  }

  loadData(tenant) {
    let context = {tenant};
    return this.loadTenantPackage(context)
          .then(this.loadPackageTemplate.bind(this))
          .then(this.loadTemplates.bind(this));
  }

  saveData(context) {
    if (this.compareTemplates(context.newTemplate, context.template)) {
      return this.createIssue(context);
    } else {
      return this.extendPackage(context);
    }
  }

  // Private API section
  loadTenantPackage(context) {
    return this.openstackPackagesService.getList({
      tenant: context.tenant.uuid
    }).then(packages => {
      if (packages.length === 1) {
        return angular.extend(context, {
          package: packages[0]
        });
      } else {
        return this.$q.reject();
      }
    });
  }

  loadPackageTemplate(context) {
    return this.packageTemplatesService.$get(
      null, context.package.template
    ).then(template => angular.extend(context, {
      template: templateParser(template)
    }));
  }

  loadTemplates(context) {
    return this.packageTemplatesService.getAll({
      settings_uuid: context.tenant.service_settings_uuid
    }).then(templates => angular.extend(context, {
      templates: templates.map(templateParser).filter(
        template => template.uuid !== context.template.uuid
      )
    }));
  }

  compareTemplates(a, b) {
    return a.cores < b.cores || a.ram < b.ram || a.storage < b.storage;
  }

  createIssue(context) {
    return this.issuesService.createIssue({
      summary: this.formatIssueSummary(context),
      description: this.formatIssueDescription(context)
    });
  }

  extendPackage(context) {
    return this.openstackPackagesService.extend(context.package.uuid, context.newTemplate.uuid);
  }

  formatIssueSummary(context) {
    return `Please downgrade tenant '${context.tenant.name}' to VPC '${context.newTemplate.name}'`;
  }

  formatIssueDescription(context) {
    // Indentation is not used here in order to format description correctly
    return `
Tenant name: ${context.tenant.name};
tenant UUID: ${context.tenant.uuid};
requested VPC template name: ${context.newTemplate.name};
requested VPC template UUID: ${context.newTemplate.uuid}`
  }
}