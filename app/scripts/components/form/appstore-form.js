import template from './appstore-form.html';

export default function appstoreForm() {
  return {
    restrict: 'E',
    template: template,
    scope: {
      fields: '=',
      model: '=',
      errors: '='
    },
    controller: AppstoreFormController,
    controllerAs: '$ctrl',
    bindToController: true
  }
}

class AppstoreFormController {
  constructor($scope) {
    const options = this.fields.options;
    const watchers = this.fields.watchers;
    const order = this.fields.order;
    const model = this.model;

    this.fieldsList = order.map(name => options[name]);
    angular.forEach(watchers, (watcher, field) => {
      $scope.$watch(() => model[field], watcher.bind(null, model, options));
    });
  }

  renderLabel(field) {
    return field.type != 'boolean' && field.type != 'label';
  }
}