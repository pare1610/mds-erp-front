import {
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
} from 'keycloak-angular';

const localhostCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(https:\/\/erp\.proelectricos\.com\/api)(\/.*)?$/i,

});

const buildAppUrl = (path: string) => {
  const basePath = new URL(document.baseURI).pathname.replace(/\/$/, '');
  return `${window.location.origin}${basePath}${path}`;
};

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      realm: 'MDSERP',
      url: 'https://erp.proelectricos.com/auth',
      clientId: 'mds-erp-front',
    },
    initOptions: {
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: buildAppUrl('/silent-check-sso.html'),
      redirectUri: buildAppUrl('/'),
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 1000,
      }),
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [localhostCondition],
      },
    ],
  });
