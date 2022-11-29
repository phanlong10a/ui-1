import { Button, Form, Input } from 'antd';
import React from 'react';
import { useLogin } from './service';

import styles from './index.less';
import { useTranslate } from '@/utils/hooks/useTranslate';

const Login: React.FC = () => {
  const { t } = useTranslate();
  const { loading, run } = useLogin();

  const onFinish = (values: any) => {
    run(values);
  };

  return (
    <div className={styles.loginWrap}>
      <h1>Locamos Business</h1>
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          phone_number: 'vuhoan485@gmail.com',
          password: 'hoan10a8',
        }}
      >
        <Form.Item
          className={styles.formItem}
          label={t('user_or_phone_number')}
          name="phone_number"
          rules={[
            {
              required: true,
              message: t('error.require', {
                field: t('user_or_phone_number'),
              }),
            },
          ]}
        >
          <Input type="text" placeholder={t('user_or_phone_number')} />
        </Form.Item>

        <Form.Item
          label={t('password')}
          name="password"
          rules={[
            {
              required: true,
              message: t('error.require', {
                field: t('password'),
              }),
            },
          ]}
        >
          <Input.Password placeholder={t('password')} />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className={styles.btnSubmit}
        >
          {t('login')}
        </Button>
      </Form>
    </div>
  );
};

export default Login;
