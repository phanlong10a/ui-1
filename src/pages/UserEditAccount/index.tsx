import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Skeleton,
  Tree,
  Typography,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  history,
  Link,
  useIntl,
  useLocation,
  useParams,
  useRequest,
} from 'umi';
import styles from './index.less';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { useTranslate } from '@/utils/hooks/useTranslate';
import Dialog from './Components/Dialog';
import { useToggle } from 'ahooks';
import { getAdminAccount, getAllRole, onSubmitValue } from './service';
import { PERMISSIONS, ROLE } from '@/utils/enum';
import {
  ENVIRONMENTS,
  RESPONSE_TYPE,
  ROLE_TYPE,
  TREE_DATA_ROLE,
} from '@/utils/constant';
import { API_PATH } from '@/utils/apis';
import { RcFile } from 'antd/lib/upload';

const { Text } = Typography;

interface IAccountInfo {
  email: string;
  id?: string;
  phone: string;
  role: ROLE;
  status: boolean;
  avatar?: string;
  full_name: string;
  address?: string;
  roleId?: string;
}

export default () => {
  const params = useParams<{ id: string }>();
  const { id } = params;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { formatMessage } = useIntl();

  const [editable, setEditable] = useState(true);

  const location = useLocation();

  const { Option } = Select;

  const [dataRole, setDataRole] = useState<any[]>([]);
  const [infoAccount, setInfoAccount] = useState<IAccountInfo | null>(null);
  const [idSelected, setIdSelected] = React.useState<number | string | null>(
    null,
  );

  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('');
  const [checkedRole, setCheckedRole] = React.useState<any>(null);
  const [avatarLink, setAvatarLink] = React.useState<any>(null);

  useEffect(() => {
    if (location.pathname.includes('admin-detail')) setEditable(false);
    else setEditable(true);
  }, [location]);

  useRequest(getAllRole, {
    onSuccess(res: any) {
      if (res?.get_list_role?.data) {
        setDataRole(res?.get_list_role?.data);
      }
    },
  });

  const handleChange = (value: string) => {
    setSelectedRoleId(value);
  };

  useEffect(() => {
    const { id } = params;
    if (id) {
      getAdminRequest.run(id);
    } else {
      setInfoAccount(null);
    }
  }, [params]);

  //effect for checked roles
  useEffect(() => {
    if (selectedRoleId && selectedRoleId !== '') {
      handleRoleChecked(selectedRoleId);
    }
  }, [selectedRoleId]);

  const handleRoleChecked = (id: string) => {
    const roles = dataRole.find((dataRole) => dataRole.id === id);
    if (!roles?.permissions) return;
    const listRoleCheck = [];
    for (let role in roles.permissions) {
      if (role === 'id') continue;
      if (roles.permissions[role] === PERMISSIONS.FULL) {
        listRoleCheck.push(`${role}_${PERMISSIONS.FULL}`);
        listRoleCheck.push(`${role}_${PERMISSIONS.READ}`);
      }
      if (roles.permissions[role] === PERMISSIONS.READ) {
        listRoleCheck.push(`${role}_${PERMISSIONS.READ}`);
      }
    }
    setCheckedRole(listRoleCheck);
  };
  const { t } = useTranslate();

  const [openDialog, setOpenDialog] = useToggle(false);

  const handleDelete = () => {
    setOpenDialog.set(true);
  };

  const getAdminRequest = useRequest(getAdminAccount, {
    manual: true,
    onSuccess(res: any) {
      if (res?.get_one_admin?.message !== RESPONSE_TYPE.SUCCESS) {
        throw new Error(res.get_one_admin?.message);
      }
      const data = res.get_one_admin.data;
      if (data.admin_profile?.avatar && data.admin_profile?.avatar !== 'null') {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: `http://${data?.admin_profile?.avatar}`,
          },
        ]);
        setAvatarLink(data?.admin_profile?.avatar);
      }

      const infoRes: IAccountInfo = {
        email: data.email,
        id: data.id,
        phone: data.phone,
        role: data.role,
        roleId: data.role?.id,
        status: data.status,
        avatar: data.admin_profile?.avatar,
        full_name: data.admin_profile?.full_name,
        address: data.admin_profile?.address,
      };
      setInfoAccount(infoRes);
      setSelectedRoleId(data.role?.id);
    },
  });

  const requestUpdateAdmin = useRequest(onSubmitValue, {
    manual: true,
    onSuccess(data: any) {
      if (data) {
        history.push('/admin');
        message.success('Edit success message');
      }
    },
  });

  const onFinish = (values: any) => {
    const data = {
      query: `
      mutation {
        update_admin(
          input: {
            phone: "${values.phone}"
            email: "${values.email}"
            id: "${id}"
            status: true
            password: "${values.password}"
            full_name: "${values.full_name}"
            roleId: "${selectedRoleId}"
            admin_profile:{
              avatar: "${avatarLink}"
            }
          }
        ) {
          message
          data {
            email
            phone
            id
            status
            admin_profile {
              id
              full_name
              date_of_birth
              address
              date_modified
              date_created
              admin_id
              avatar
            } 
          }
        }
      }
      `,
    };
    requestUpdateAdmin.run(data);
  };
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  const onChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
    event,
  }) => {
    if (file.response) {
      setAvatarLink(file.response.path);
    }
    setFileList(newFileList);
  };

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <Link to="/admin" className={styles.previousEditLink}>
            <LeftOutlined />
            <div>
              {editable
                ? formatMessage({ id: 'admin_edit_account' })
                : formatMessage({ id: 'admin_view_account' })}
            </div>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.tableComponent}>
        {params.id && !infoAccount ? (
          <Skeleton active />
        ) : (
          <Form
            name="basic"
            className={styles.itemForm}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ ...infoAccount }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row>
              <Col span={12}>
                <div className={styles.detailAdm}>
                  <div>
                    <div className={styles.uploadFileWrapper}>
                      <Upload
                        action={ENVIRONMENTS.API_URL + API_PATH.UPLOAD}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        className={styles.uploadFile}
                        onRemove={() => {
                          setAvatarLink(null);
                        }}
                        disabled={!editable}
                      >
                        {fileList.length < 1 && 'Upload Avatar'}
                      </Upload>
                    </div>
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
                        <Input placeholder="Admin" disabled={!editable} />
                      </Form.Item>
                      <Form.Item
                        label={formatMessage({
                          id: 'const_column_phone_number',
                        })}
                        name="phone"
                        rules={[
                          {
                            required: true,
                            message: t('error.require', {
                              field: t('const_column_phone_number'),
                            }),
                          },
                          {
                            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                            message: t('error.patern', {
                              field: t('const_column_phone_number'),
                            }),
                          },
                        ]}
                      >
                        <Input
                          placeholder={formatMessage({
                            id: 'const_column_phone_number',
                          })}
                          disabled={!editable}
                        />
                      </Form.Item>
                      <Form.Item
                        label={formatMessage({ id: 'const_column_email' })}
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: t('error.require', {
                              field: t('email'),
                            }),
                          },
                          {
                            type: 'email',
                            message: t('error.email', {
                              field: t('email'),
                            }),
                          },
                        ]}
                      >
                        <Input
                          placeholder="const_column_email"
                          disabled={!editable}
                        />
                      </Form.Item>
                      <Form.Item
                        label={formatMessage({ id: 'password' })}
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: t('error.require', {
                              field: t('password'),
                            }),
                          },
                          {
                            min: 8,
                            max: 99,
                            message: t('error.password', {
                              field: t('password'),
                            }),
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder={formatMessage({ id: 'password' })}
                          disabled={!editable}
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
                              if (
                                !value ||
                                getFieldValue('password') === value
                              ) {
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
                        <Input.Password disabled={!editable} />
                      </Form.Item>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={'Phân quyền'}
                  name="roleId"
                  rules={[
                    {
                      required: true,
                      message: t('error.require', {
                        field: t('decentralization'),
                      }),
                    },
                  ]}
                >
                  <Select
                    defaultValue="chọn nhóm phân quyền"
                    style={{ width: '100%' }}
                    onChange={handleChange}
                    disabled={!editable}
                  >
                    {dataRole.map((item) => (
                      <>
                        <Option key={item.id} value={item.id}>
                          {item.role_name}
                        </Option>
                      </>
                    ))}
                  </Select>
                </Form.Item>

                <div className={styles.selectAdmin}>
                  <Tree
                    checkable
                    disabled
                    className={styles.tree}
                    defaultExpandAll
                    checkedKeys={checkedRole}
                    treeData={TREE_DATA_ROLE}
                  />
                </div>
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
                    onClick={handleDelete}
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
      </div>
      {openDialog && (
        <Dialog
          open={openDialog}
          setOpen={(b) => {
            setOpenDialog.set(b);
          }}
          itemEdit={idSelected}
        />
      )}
    </>
  );
};
