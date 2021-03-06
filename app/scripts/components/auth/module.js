import authService from './auth-service';
import { authLogin } from './auth-login';
import poweredBy from './powered-by';
import { authInit } from './auth-init';
import authActivation from './auth-activation';
import authRoutes from './routes';
import initAuthProvider from './auth-config';
import interceptorModule from './interceptor';
import UserSettings from './user-settings';
import storeLastState from './store-state';
import callbacksModule from './callbacks/module';
import estonianIdModule from './estonianId/module';
import saml2Module from './saml2/module';

export default module => {
  module.service('authService', authService);
  module.component('authLogin', authLogin);
  module.component('poweredBy', poweredBy);
  module.component('authInit', authInit);
  module.directive('authActivation', authActivation);
  module.config(authRoutes);
  module.config(initAuthProvider);
  interceptorModule(module);
  callbacksModule(module);
  estonianIdModule(module);
  saml2Module(module);
  module.service('UserSettings', UserSettings);
  module.run(storeLastState);
};
