import { LeftOutlined, UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Form,
  message,
  Row,
  Select,
  Switch,
  Tree,
  Typography,
  Upload,
  UploadFile,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { history, Link, useIntl, useParams } from 'umi';
import styles from './index.less';

import type { DataNode, TreeProps } from 'antd/es/tree';
import { useTranslate } from '@/utils/hooks/useTranslate';
import PersonalInfo from './Components/PersonalInfo';
import { useRequest, useToggle } from 'ahooks';
import Dialog from './Components/Dialog';
import { onSubmitValue } from './service';
import { getAllRole } from '../UserEditAccount/service';
import { PERMISSIONS } from '@/utils/enum';
import { ENVIRONMENTS, TREE_DATA_ROLE } from '@/utils/constant';
import { RcFile, UploadProps } from 'antd/es/upload/interface';
import { API_PATH } from '@/utils/apis';

export default () => {
  const { formatMessage } = useIntl();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [ellipsis, setEllipsis] = useState(false);

  const [dataRole, setDataRole] = useState<any[]>([]);

  useRequest(getAllRole, {
    onSuccess(res: any) {
      if (res?.data?.get_list_role?.data) {
        setDataRole(res?.data?.get_list_role?.data);
      }
    },
  });

  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('');
  const [checkedRole, setCheckedRole] = React.useState<any>(null);
  const [avatarLink, setAvatarLink] = React.useState<any>(null);

  useEffect(() => {
    if (selectedRoleId && selectedRoleId !== '') {
      handleRoleChecked(selectedRoleId);
    }
  }, [selectedRoleId]);

  const handleRoleChecked = (id: string) => {
    const roles = dataRole.find((dataRole) => dataRole.id === id);
    if (!roles.permissions) return;
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

  const requestCreateUser = useRequest(onSubmitValue, {
    manual: true,
    onSuccess(data: any) {
      if (data.errors) {
        message.error('create account error message');
      } else {
        history.push('/admin');
        message.success('Create account success message');
      }
    },
  });

  const { Option } = Select;

  const handleChange = (value: string) => {
    setSelectedRoleId(value);
  };

  const { t } = useTranslate();
  const [openDialog, setOpenDialog] = useToggle(false);
  const [idSelected, setIdSelected] = React.useState<number | string | null>(
    null,
  );
  const handleDelete = () => {
    setOpenDialog.set(true);
  };

  const onFinish = (values: any) => {
    const submitValues = {
      email: values.email,
      phone: values.phoneNumber,
      password: values.password,
      fullname: values.fullName,
      roleId: values.roleId,
      avatar: avatarLink,
    };

    const data = {
      query: `
      mutation {
        admin_register(
          admin_register: {
            email: "${submitValues.email}"
            phone: "${submitValues.phone}"
            password: "${submitValues.password}"
            status: true
            full_name: "${submitValues.fullname}"
            roleId: "${submitValues.roleId}"
            avatar: "${submitValues.avatar}"
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
    requestCreateUser.run(data);
  };
  const onFinishFailed = (errorInfo: any) => { };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item className={styles.breacrumbItem}>
          <Link to="/user" className={styles.previousEditLink}>
            <LeftOutlined />
            <div>{formatMessage({ id: 'admin_new_account' })}</div>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className={styles.tableComponent}>
        <Form
          name="basic"
          className={styles.itemForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row>
            <Col span={12}>
              <div className={styles.detailAdm}>
                <div className={styles.uploadFileWrapper}>
                  {/* @ts-ignore */}
                  <Upload
                    action={ENVIRONMENTS.API_URL + '/avatar/api/upload_images'}
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    className={styles.uploadFile}
                    onRemove={() => {
                      setAvatarLink(null);
                    }}
                  >
                    {fileList.length < 1 && 'Upload Avatar'}
                  </Upload>
                </div>
                <PersonalInfo />
              </div>
            </Col>
          </Row>
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
        </Form>
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
