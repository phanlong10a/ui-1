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
  Switch,
} from 'antd';
import styles from '../index.less';
type Props = {};

const PersonalInfo = (props: Props) => {
  const [editable, setEditable] = useToggle(false);
  const { t } = useTranslate();
  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      hideRequiredMark
      layout="horizontal"
      // onFinish={onFinish}
      className={styles.mainInfoUser}
      autoComplete="off"
    >
      <div className={styles.editIcon} onClick={() => setEditable.set(true)}>
        <EditOutlined style={{ fontSize: 24 }} />
      </div>
      <Row>
        <Col xs={24} md={12}>
          <Form.Item
            name="fullName"
            label={t('fullname')}
            // initialValue={userInfo.fullName}
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
              <Select.Option value="male">
                {t('general_gender_male')}
              </Select.Option>
              <Select.Option value="female">
                {t('general_gender_female')}
              </Select.Option>
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
            <Button type="primary" className={styles.addButton}>
              {t('general_save')}
            </Button>
          </Col>
        </Row>
      )}
    </Form>
  );
};

export default PersonalInfo;
