import { Button, Form, Input, Radio, RadioChangeEvent } from 'antd';
import React, { useState } from 'react';
import { useLogin } from './service';

import styles from './index.less';
import { useTranslate } from '@/utils/hooks/useTranslate';
import axios from 'axios';
import { API_PATH } from '@/utils/apis';
import { ENVIRONMENTS } from '@/utils/constant';
import Dialog from './Components/Dialog';

const Login: React.FC = () => {
  const { t } = useTranslate();
  const { loading, run } = useLogin();
  const [isForgot, setIsForgot] = useState(false);
  const [isForgotEmail, setIsForgotEmail] = useState(true);
  const [isOpenDialog, setIsOpenDialog] = useState(false)

  const onFinish = async (values: any) => {
    if (isForgot) {
      if (isForgotEmail) {
        await axios.post(ENVIRONMENTS.API_URL + API_PATH.forgot_email, {
          email: values.phone_number
        })
      } else {
        await axios.post(ENVIRONMENTS.API_URL + API_PATH.forgot_phone, {
          phone: values.phone_number
        })
        setIsOpenDialog(true)
      }
    } else {
      run(values);
    }
  };

  return (
    <div className={styles.loginWrap}>
      <h1>Chấm công</h1>
      {
        !isForgot ? <Form
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
        </Form> :
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
              label="Quên mật khẩu bằng"
              initialValue={true}
              rules={[
                {
                  required: true,
                  message: t('error.require'),
                },
              ]}
            >
              <Radio.Group
                defaultValue={true}
                onChange={(e: RadioChangeEvent) => {
                  console.log('radio checked', e.target.value);
                  setIsForgotEmail(e.target.value);
                }} >
                <Radio value={true}>Email</Radio>
                <Radio value={false}>Số điện thoại</Radio>
              </Radio.Group>

            </Form.Item>

            <Form.Item
              name="phone_number"
              rules={[
                {
                  required: true,
                  message: t('error.require', {
                    field: t('password'),
                  }),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.btnSubmit}
            >
              Gửi thông tin
            </Button>
          </Form>
      }
      {!isForgot ?
        <Button
          type="ghost"
          onClick={() => {
            setIsForgot(true);
          }}
          className={styles.btnSubmit}
        >
          Quên mật khẩu
        </Button> : <Button
          type="ghost"
          loading={loading}
          onClick={() => {
            setIsForgot(false);
          }}
          className={styles.btnSubmit}
        >
          Quay lại
        </Button>
      }
      {isOpenDialog && (
        <Dialog
          open={isOpenDialog}
          setOpen={(b) => {
            setIsOpenDialog(b);
          }}
          itemEdit={null}
        />
      )}
    </div>
  );
};

export default Login;
