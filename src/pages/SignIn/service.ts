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
        console.log('🚀 ~ file: service.ts:33 ~ useLogin ~ result', result);
        const loginItem = {
          token: result.token,
          refreshToken: result.refresh_token,
          role: result.role,
          fullName: result.fullName,
        };
        onLogin(loginItem);
      },
      onError: (err) => {
        message.error('Account not found');
      },
    },
  );
};
