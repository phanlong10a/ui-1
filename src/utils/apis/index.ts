import { extend } from 'umi-request';
import axios from 'axios';
import { ENVIRONMENTS } from '../constant';
import TokenManagement from './TokenManagement';

const localeInfo = localStorage.getItem('umi_locale') || 'vi-VN';

const request = extend({
  prefix: ENVIRONMENTS.API_URL,
});

const injectBearer = (token: string, configs: any) => {
  console.log(localeInfo);
  if (!configs) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': localeInfo,
      },
    };
  }

  if (configs.headers) {
    return {
      ...configs,
      headers: {
        ...configs.headers,
        Authorization: `Bearer ${token}`,
        'Accept-Language': localeInfo,
      },
    };
  }

  return {
    ...configs,
    headers: {
      Authorization: `Bearer ${token}`,
      'Accept-Language': localeInfo,
    },
  };
};

const TokenManager = new TokenManagement({
  isTokenValid: () => {
    const localInfo = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let localInfoObject;

    if (localInfo) {
      localInfoObject = JSON.parse(localInfo);
    }
    return !!localInfoObject?.token;
  },
  getAccessToken: () => {
    const localInfo = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let localInfoObject;

    if (localInfo) {
      localInfoObject = JSON.parse(localInfo);
    }

    return localInfoObject?.token || '';
  },
  onRefreshToken(done) {
    const localInfo = window?.localStorage.getItem(
      ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
    );
    let localInfoObject;
    if (localInfo) {
      localInfoObject = JSON.parse(localInfo);
    }
    const refreshToken =
      localInfoObject?.data?.login_admin?.data?.refresh_token;
    request
      .post('/graphql', {
        data: {
          query: `
            mutation {
              refresh_token(input: "${refreshToken}", type: 1) {
                token
                refresh_token
              }
            }
          `,
        },
      })
      .then((result) => {
        if (
          result.data?.refresh_token.refresh_token &&
          result.data?.refresh_token.token
        ) {
          done(result.data?.refresh_token);
          return;
        }
        done(null);
      })
      .catch((err) => {
        console.error(err);
        done(null);
      });
  },
});

const privateRequest = async (
  request: any,
  suffixUrl: string,
  configs?: any,
) => {
  const token: string = (await TokenManager.getToken()) as string;
  return request(suffixUrl, injectBearer(token, configs)).then(
    async (res: any) => {
      if (
        res.errors &&
        res.errors[0].extensions?.response?.statusCode === 401
      ) {
        await TokenManager.getNewToken().then((res: any) => {
          if (!res) return;
          const localInfo = window?.localStorage.getItem(
            ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
          );
          let localInfoObject;

          if (localInfo) {
            localInfoObject = JSON.parse(localInfo);
          }
          if (localInfoObject?.data?.login_admin?.data) {
            localInfoObject.data.login_admin.data.token = res.token;
            localInfoObject.data.login_admin.data.refresh_token =
              res.refresh_token;
          }
          window?.localStorage.setItem(
            ENVIRONMENTS.LOCAL_STORAGE_KEY as string,
            JSON.stringify(localInfoObject),
          );
          window?.location.reload();
        });
      }
      return res;
    },
  );
};

const API_PATH = {
  default: '/graphql',
  // Auth
  UPLOAD: '/upload-service/file',
  LOGIN: '/auth/api/login',
  LIST_USER: '/user/api/list-employee',
  REFRESH_TOKEN: '/auth/refreshToken',
  FORGOT_PASSWORD: '/auth/forgotPassword',
  RESET_PASSWORD: '/auth/resetPassword',
  LOGOUT: '/auth/logout',
  USER: '/user',
  ADMIN_USER: 'admin/user',
};

export { API_PATH, request, privateRequest };
