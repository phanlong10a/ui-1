import { OPTION_GENDER, RESPONSE_TYPE } from '@/utils/constant';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { EditOutlined } from '@ant-design/icons';
import { useToggle } from 'ahooks';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Switch,
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useRequest } from 'umi';
import styles from '../index.less';
import { updateUserInfo } from '../service';

const PersonalInfo = ({ infoAccount, getDataUser }: any) => {
  const params = useParams<{ id: string }>();

  const [form] = Form.useForm();

  const [editable, setEditable] = useToggle(false);
  const { t } = useTranslate();

  const updateDataRequest = useRequest(updateUserInfo, {
    manual: true,
    onSuccess(res) {
      getDataUser.refresh();
      setEditable.set(false);
    },
  });

  const onSubmit = (value: any) => {
    updateDataRequest.run({ ...value, userId: infoAccount.userId });
  };

  return (
    <>
      {params.id && !infoAccount ? (
        <Skeleton active />
      ) : (
        <Form
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          onFinish={onSubmit}
          layout="horizontal"
          className={styles.mainInfoUser}
          initialValues={infoAccount}
          autoComplete="off"
        >
          <div
            className={styles.editIcon}
            onClick={() => setEditable.set(true)}
          >
            <EditOutlined style={{ fontSize: 24 }} />
          </div>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item
                name="full_name"
                label={t('fullname')}
                // initialValue={infoAccount.fullName}
                rules={[
                  {
                    required: true,
                    message: t('error.require', {
                      field: t('fullname'),
                    }),
                  },
                ]}
              >
                <Input placeholder={t('fullname')} disabled={!editable} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label={t('phone_number')}
                // initialValue={userInfo.fullName}
                rules={[
                  {
                    required: true,
                    message: t('error.require', {
                      field: t('phone_number'),
                    }),
                  },
                ]}
              >
                <Input placeholder={t('phone_number')} disabled={!editable} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label={t('email')}
                // initialValue={userInfo.fullName}
                rules={[
                  {
                    required: true,
                    message: t('error.require', {
                      field: t('email'),
                    }),
                  },
                ]}
              >
                <Input placeholder={t('email')} disabled={!editable} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item
                name="date_of_birth"
                label={t('date_of_birth')}
                // initialValue={userInfo.fullName}
                rules={[
                  {
                    required: true,
                    message: t('error.require', {
                      field: t('date_of_birth'),
                    }),
                  },
                ]}
              >
                {/* @ts-ignore */}
                <DatePicker style={{ width: '100%' }} disabled={!editable} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label={t('general_gender')}
                // initialValue={userInfo.fullName}
                rules={[
                  {
                    required: true,
                    message: t('error.require', {
                      field: t('general_gender'),
                    }),
                  },
                ]}
              >
                <Select disabled={!editable}>
                  {OPTION_GENDER.map((e, i) => {
                    return (
                      <Select.Option value={e.value} key={i}>
                        {t(e.name)}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label={t('status')}
                valuePropName="checked"
                // initialValue={userInfo.fullName}
              >
                <Switch disabled={!editable} />
              </Form.Item>
            </Col>
          </Row>
          {editable && (
            <Row
              align="middle"
              justify="center"
              className={styles.submitButtonGroup}
            >
              <Col>
                <Button
                  danger
                  onClick={() => setEditable.set(false)}
                  className={styles.addButton}
                >
                  {t('general_cancel')}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.addButton}
                >
                  {t('general_save')}
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      )}
    </>
  );
};

export default PersonalInfo;
