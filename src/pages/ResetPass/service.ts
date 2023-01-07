import { useAuth } from '@/utils/hooks/useAuth';
import { API_PATH, request } from '@/utils/apis';
import { useRequest } from 'ahooks';
import { message } from 'antd';

export const useLogin = () => {
  const { onLogin } = useAuth();

  return useRequest(
    async (values) => {
      return request.post(API_PATH.LOGIN, {
        data: {
          email: values?.phone_number?.trim(),
          password: values?.password,
        },
      });
    },
    {
      manual: true,
      onSuccess: (result) => {
        console.log('🚀 ~ file: service.ts:32 ~ useLogin ~ result', result);
        if (result?.statusCode === 400) throw new Error('Account not found');
        const loginItem = {
          token: result.payload.token,
          refreshToken: result.payload.refresh_token,
        };
        onLogin(loginItem);
      },
      onError: (err) => {
        console.log('🚀 ~ file: service.ts:32 ~ useLogin ~ err', err);
      },
    },
  );
};
