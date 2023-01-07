import { useTranslate } from '@/utils/hooks/useTranslate';
import { Form, Input, Select } from 'antd';
import { useIntl } from 'umi';
import styles from '../index.less';
type Props = {
  listPosition: any[];
  listDepartment: any[];
};

const PersonalInfo = (props: Props) => {
  const { t } = useTranslate();
  const { formatMessage } = useIntl();

  return (
    <div className={styles.formGeneric}>
      <Form.Item
        label={formatMessage({ id: 'fullname' })}
        name="fullName"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('fullname'),
            }),
          },
        ]}
      >
        <Input placeholder="Full Name" />
      </Form.Item>
      <Form.Item
        label={formatMessage({ id: 'email' })}
        name="email"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('address'),
            }),
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input placeholder="email" />
      </Form.Item>
    </div>
  );
};

export default PersonalInfo;
