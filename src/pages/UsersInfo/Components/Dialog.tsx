import { useRequest, useSetState, useToggle } from 'ahooks';
import {
  Col,
  Modal,
  Form,
  Image,
  Input,
  message,
  Row,
  Select,
  Skeleton,
  Button,
} from 'antd';
import React, { useState } from 'react';
import { paternPhone } from '@/utils/patern';
import { useIntl } from 'umi';
import { createUser, editUser, getUserData } from '../service';
const { Option } = Select;
import styles from '../index.less';
import { OPTION_GENDER, OPTION_STATUS_ACTIVE } from '@/utils/constant';
import { StatusAccount } from '@/utils/enum';
import { paternpassWord } from '@/utils/patern';

interface Iprops {
  open: boolean;
  setOpen: (b: boolean) => void;
  itemEdit: any;
}

interface IUser {
  address?: string;
  avatar?: any;
  createdAt?: string;
  dateOfBirth?: string;
  email?: string;
  fullName?: string;
  gender?: string;
  id?: string | number;
  identificationCode?: string;
  isActive?: true;
  phone?: string;
  points?: number;
  referralCode?: string;
  roles?: Array<any>;
  status?: string;
  updatedAt?: string;
}

const Dialog: React.FC<Iprops> = ({
  open,
  setOpen,
  itemEdit,
  children,
  ...rest
}) => {
  const [loading, setLoading] = useState(true);
  const [editable, setEditable] = useToggle(false);
  const [userInfo, setUserInfo] = useSetState<IUser>({});

  const { formatMessage } = useIntl();
  const requestUser = useRequest(getUserData, {
    manual: true,
    onSuccess: (res: any) => {
      console.log(res);
      setUserInfo(res);
    },
    onError: (rej) => {
      message.error(rej.message);
    },
    onFinally: () => {
      setLoading(false);
    },
  });

  const requestCreateUser = useRequest(createUser, {
    manual: true,
    onSuccess: (res: any) => {
      message.success(formatMessage({ id: 'message_add_user_success' }));
      setUserInfo(res);
      setOpen(false);
    },
    onError: (rej: any) => {
      // message.error(formatMessage({ id: 'message_add_user_failure' }));
      message.error(
        rej.errors[0] ? rej.errors[0] : formatMessage({ id: 'error' }),
      );
    },
    onFinally: () => {
      setLoading(false);
    },
  });
  const requestEditUser = useRequest(editUser, {
    manual: true,
    onSuccess: (res: any) => {
      message.success(formatMessage({ id: 'message_user_success' }));
      setUserInfo(res);
      setOpen(false);
    },
    onError: (rej: any) => {
      // message.error(formatMessage({ id: 'message_user_failure' }));
      message.error(
        rej.errors[0] ? rej.errors[0] : formatMessage({ id: 'error' }),
      );
    },
    onFinally: () => {
      setLoading(false);
    },
  });

  const getUser = () => {};

  React.useEffect(() => {
    if (itemEdit) {
      requestUser.run(itemEdit);
    } else {
      setUserInfo({});
      setLoading(false);
      setEditable.set(true);
    }
  }, [itemEdit]);

  const onEdit = (e: any) => {
    e.preventDefault();
    setEditable.set(true);
  };

  const onFinish = (value: any) => {
    if (itemEdit) {
      requestEditUser.run(userInfo.id, value);
      return;
    }
    requestCreateUser.run(value);
    return;
  };

  return (
    <>
      <Modal
        title={
          itemEdit
            ? editable
              ? formatMessage({ id: 'general_edit_infomation' })
              : formatMessage({ id: 'general_view_infomation' })
            : formatMessage({ id: 'general_add' })
        }
        centered
        width={720}
        onCancel={() => setOpen(false)}
        visible={open}
        footer={null}
        // extra={
        //     <Space>
        //         <Button onClick={() => setOpen(false)}>Cancel</Button>
        //         <Button onClick={() => setOpen(false)} type="primary">
        //             Submit
        //         </Button>
        //     </Space>
        // }
      >
        {requestUser.loading || loading ? (
          <Skeleton active />
        ) : (
          <>
            {userInfo.avatar && (
              <div
                style={{
                  marginBottom: 24,
                }}
              >
                <Image
                  src={userInfo.avatar?.url}
                  style={{ borderRadius: '100%' }}
                  placeholder={formatMessage({ id: 'general_preview_image' })}
                  preview={{
                    mask: <>{formatMessage({ id: 'general_preview_image' })}</>,
                    maskClassName: 'round-circle',
                  }}
                  width={100}
                />
              </div>
            )}
            <Form
              layout="vertical"
              hideRequiredMark
              onFinish={onFinish}
              autoComplete="off"
              initialValues={userInfo}
            >
              <Row gutter={16}>
                <Col span={12} className={styles.dialogFormItem}>
                  <Form.Item
                    name="fullName"
                    label={formatMessage({ id: 'fullname' })}
                    // initialValue={userInfo.fullName}
                    rules={[
                      {
                        required: true,
                        message: formatMessage(
                          { id: 'error.require' },
                          {
                            field: formatMessage({ id: 'fullname' }),
                          },
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder={formatMessage({ id: 'fullname' })}
                      disabled={!editable}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} className={styles.dialogFormItem}>
                  <Form.Item
                    name="phone"
                    label={formatMessage({ id: 'phone_number' })}
                    // initialValue={userInfo.phone}
                    rules={[
                      {
                        required: true,
                        message: formatMessage(
                          { id: 'error.require' },
                          {
                            field: formatMessage({ id: 'phone_number' }),
                          },
                        ),
                      },
                      {
                        pattern: paternPhone,
                        message: formatMessage(
                          { id: 'error.patern' },
                          {
                            field: formatMessage({ id: 'phone_number' }),
                          },
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder={formatMessage({ id: 'phone_number' })}
                      disabled={!editable}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} className={styles.dialogFormItem}>
                  <Form.Item
                    name="status"
                    label={formatMessage({ id: 'status' })}
                    initialValue={StatusAccount.ACTIVE}
                  >
                    <Select disabled={!editable}>
                      {OPTION_STATUS_ACTIVE.map((status, index) => (
                        <Option value={status.value} key={index}>
                          {formatMessage({ id: status.name })}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12} className={styles.dialogFormItem}>
                  <Form.Item
                    name="gender"
                    label={formatMessage({ id: 'general_gender' })}
                    initialValue={
                      userInfo.gender
                        ? OPTION_GENDER.find(
                            (item) => item.value === userInfo.gender,
                          )
                        : OPTION_GENDER[0].value
                    }
                    rules={[
                      {
                        required: true,
                        message: formatMessage(
                          { id: 'error.require' },
                          {
                            field: formatMessage({ id: 'general_gender' }),
                          },
                        ),
                      },
                    ]}
                  >
                    <Select disabled={!editable}>
                      {OPTION_GENDER.map((gender, index) => (
                        <Option value={gender.value} key={index}>
                          {formatMessage({ id: gender.name })}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12} className={styles.dialogFormItem}>
                  <Form.Item
                    name="email"
                    label={formatMessage({ id: 'email' })}
                    rules={[
                      {
                        required: true,
                        message: formatMessage(
                          { id: 'error.require' },
                          {
                            field: formatMessage({ id: 'email' }),
                          },
                        ),
                      },
                      {
                        type: 'email',
                        message: formatMessage({ id: 'error.email' }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={formatMessage({ id: 'email' })}
                      disabled={!editable}
                    />
                  </Form.Item>
                </Col>
                <Col span={12} className={styles.dialogFormItem}>
                  <Form.Item
                    name="password"
                    label={formatMessage({ id: 'password' })}
                    rules={[
                      {
                        required: true,
                        message: formatMessage(
                          { id: 'error.require' },
                          {
                            field: formatMessage({ id: 'password' }),
                          },
                        ),
                      },
                      {
                        pattern: paternpassWord,
                        message: formatMessage(
                          { id: 'error.patern' },
                          {
                            field: formatMessage({ id: 'password' }),
                          },
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder={formatMessage({ id: 'password' })}
                      type="password"
                      disabled={!editable}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className={styles.addGroupButton}>
                {/* <Button className={styles.addButton}>Thêm mới</Button> */}
                <Button
                  danger
                  onClick={() => setOpen(false)}
                  className={styles.addButton}
                >
                  {formatMessage({ id: 'general_cancel' })}
                </Button>
                {editable ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.addButton}
                  >
                    {formatMessage({ id: 'general_save' })}
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={(e) => onEdit(e)}
                    className={styles.addButton}
                  >
                    {formatMessage({ id: 'general_edit' })}
                  </Button>
                )}
              </div>
            </Form>
          </>
        )}
      </Modal>
    </>
  );
};

export default React.memo(Dialog);
