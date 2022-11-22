import {
  CaretRightOutlined,
  EditOutlined,
  LeftOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Form,
  Input,
  Row,
  Select,
  Skeleton,
  Switch,
  Tree,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useIntl, useParams, useRequest } from 'umi';
import styles from './index.less';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { getAdmin } from './service';
import { RESPONSE_TYPE } from '@/utils/constant';

const treeData: DataNode[] = [
  {
    title: 'Quản lý tài khoản người dùng',
    key: '0-0',
    children: [
      {
        title: 'Xem',
        key: '0-0-1',
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: '0-0-2',
      },
    ],
  },
  {
    title: 'Quản lý tài khoản người dùng',
    key: '0-1',
    children: [
      {
        title: 'Xem',
        key: '0-1-1',
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: '0-1-2',
      },
    ],
  },
  {
    title: 'Quản lý tài khoản người dùng',
    key: '0-2',
    children: [
      {
        title: 'Xem',
        key: '0-2-1',
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: '0-2-2',
      },
    ],
  },
  {
    title: 'Quản lý tài khoản người dùng',
    key: '0-3',
    children: [
      {
        title: 'Xem',
        key: '0-3-1',
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: '0-3-2',
      },
    ],
  },
  {
    title: 'Quản lý tài khoản người dùng',
    key: '0-4',
    children: [
      {
        title: 'Xem',
        key: '0-4-1',
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: '0-4-2',
      },
    ],
  },
];

const { Panel } = Collapse;

const { Text } = Typography;

interface IAccountInfo {
  email: string;
  id?: string;
  phone: string;
  status: boolean;
  avatar?: string;
  full_name: string;
  address?: string;
}

export default () => {
  const params = useParams<{ id: string }>();
  const { formatMessage } = useIntl();

  const { Option } = Select;
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  const { t } = useTranslate();

  const [infoAccount, setInfoAccount] = useState<IAccountInfo | null>(null);
  useEffect(() => {
    const { id } = params;

    if (id) {
      getAdminRequest.run(id);
    } else {
      setInfoAccount(null);
    }
  }, [params]);

  const getAdminRequest = useRequest(getAdmin, {
    manual: true,
    onSuccess(res: any) {
      console.log(res);
      if (res.get_one_admin.message !== RESPONSE_TYPE.SUCCESS) {
        throw new Error(res.get_one_admin?.message);
      }
      const data = res.get_one_admin.data;
      const infoRes: IAccountInfo = {
        email: data.email,
        id: data.id,
        phone: data.phone,
        status: data.status,
        avatar: data.admin_profile?.avatar,
        full_name: data.admin_profile?.full_name,
        address: data.admin_profile?.address,
      };
      setInfoAccount(infoRes);
    },
  });
  const onFinish = (values: any) => {};

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <Link to="/admin" className={styles.previousEditLink}>
            <LeftOutlined />
            <div>{formatMessage({ id: 'admin_management_detail_user' })}</div>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      {params.id && !infoAccount ? (
        <Skeleton active />
      ) : (
        <Form
          name="basic"
          className={styles.itemForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ ...infoAccount }}
          autoComplete="off"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row>
            <Col span={12}>
              <div className={styles.detailAdm}>
                <div>
                  <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    className={styles.avt}
                  />

                  <div className={styles.formGeneric}>
                    <Form.Item
                      label={formatMessage({ id: 'fullname' })}
                      name="full_name"
                      rules={[
                        {
                          required: true,
                          message: t('error.require', {
                            field: t('fullname'),
                          }),
                        },
                      ]}
                    >
                      <Input placeholder="Admin" />
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({
                        id: 'const_column_phone_number',
                      })}
                      name="phone"
                    >
                      <Input
                        placeholder={formatMessage({
                          id: 'const_column_phone_number',
                        })}
                      />
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({ id: 'const_column_email' })}
                      name="email"
                    >
                      <Input placeholder="const_column_email" />
                    </Form.Item>
                    <Form.Item
                      label={formatMessage({ id: 'password' })}
                      name="password"
                    >
                      <Input.Password
                        placeholder={formatMessage({ id: 'password' })}
                      />
                    </Form.Item>
                    <Form.Item
                      name="re_password"
                      label={formatMessage({ id: 'enter_password' })}
                      dependencies={['password']}
                      hasFeedback
                      rules={[
                        {
                          required: true,
                          message: t('error.require', {
                            field: t('enter_password'),
                          }),
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                'The two passwords that you entered do not match!',
                              ),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <Text className={styles.textAdmin}>
                {formatMessage({ id: 'decentralization' })}{' '}
              </Text>
              <Select
                defaultValue="chọn nhóm phân quyền"
                style={{ width: '50%' }}
                onChange={handleChange}
              >
                <Option value="1">
                  {formatMessage({ id: 'navigation_admin' })}
                </Option>
                <Option value="2">
                  {formatMessage({ id: 'navigation_admin' })}
                </Option>
                <Option value="3">
                  {formatMessage({ id: 'navigation_admin' })}
                </Option>
                <Option value="4">
                  {formatMessage({ id: 'navigation_admin' })}
                </Option>
              </Select>

              <div className={styles.selectAdmin}>
                <Tree
                  checkable
                  className={styles.tree}
                  defaultExpandedKeys={['0-0', '0-1', '0-2', '0-3', '0-4']}
                  // defaultSelectedKeys={['0-1', '0-2']}
                  onSelect={onSelect}
                  onCheck={onCheck}
                  treeData={treeData}
                />
              </div>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};
