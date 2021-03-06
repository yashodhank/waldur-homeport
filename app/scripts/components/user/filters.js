// @ngInject
function formatRegistrationMethod($filter) {
  return function(user) {
    if (!user.registration_method) {
      return 'Default';
    } else if (user.registration_method === 'openid') {
      return 'Estonian ID';
    } else {
      return $filter('titleCase')(user.registration_method);
    }
  };
}

// @ngInject
function formatUserStatus($filter) {
  function getStatus(user) {
    if (user.is_staff && !user.is_support) {
      return gettext('Staff');
    } else if (user.is_staff && user.is_support) {
      return gettext('Staff and Support user');
    } else if (!user.is_staff && user.is_support) {
      return gettext('Support user');
    } else {
      return gettext('Regular user');
    }
  }
  return user => $filter('translate')(getStatus(user));
}

function formatLifetime() {
  return function(input) {
    let time = moment.duration(input, 'seconds'),
      hours = time.hours(),
      minutes = time.minutes(),
      seconds = time.seconds();

    if (input === null || input === 0) {
      return 'token will not timeout';
    }
    if (hours === 0 && minutes === 0) {
      return `${seconds} sec`;
    }
    if (hours === 0 && minutes !== 0) {
      return `${minutes} min`;
    }
    if (hours !== 0) {
      let template = minutes !== 0 ? `${hours} h ${minutes} min` : `${hours} h`;
      return template;
    }
  };
}

export default module => {
  module.filter('formatRegistrationMethod', formatRegistrationMethod);
  module.filter('formatUserStatus', formatUserStatus);
  module.filter('formatLifetime', formatLifetime);
};
