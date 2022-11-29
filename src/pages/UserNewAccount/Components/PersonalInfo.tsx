import { useTranslate } from '@/utils/hooks/useTranslate';
import { Form, Input, Select } from 'antd';
import { useIntl } from 'umi';
import styles from '../index.less';
type Props = {
  listPosition: any[]
  listDepartment: any[]
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
        label={formatMessage({ id: 'address' })}
        name="address"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('address'),
            }),
          },
        ]}
      >
        <Input placeholder="address" />
      </Form.Item>
      <Form.Item
        label={formatMessage({ id: 'phone' })}
        name="phone"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('phone'),
            }),
          },
          {
            pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
            message: t('error.patern', {
              field: t('phone'),
            }),
          },
        ]}
      >
        <Input
          placeholder={formatMessage({
            id: 'phone',
          })}
        />
      </Form.Item>
      <Form.Item
        name="positionId"
        label={'Vị trí'}
      >
        <Select>
          {
            props.listPosition.map((e, i) => {
              return <Select.Option value={e.id} key={e.id}>
                {e.position}
              </Select.Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="departmentId"
        label={'Department'}
      >
        <Select>
          {
            props.listDepartment.map((e, i) => {
              return <Select.Option value={e.id} key={e.id}>
                {e.department}
              </Select.Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        label={formatMessage({ id: 'dateOfBirth' })}
        name="dateOfBirth"
        rules={[
          {
            required: true,
            message: t('error.require', {
              field: t('dateOfBirth'),
            }),
          },
          {
            pattern: /^((19|2[0-9])[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
            message: t('error.patern', {
              field: t('dateOfBirth'),
            }),
          },
        ]}
      >
        <Input placeholder={formatMessage({ id: 'dateOfBirth' })} />
      </Form.Item>
    </div>
  );
};

export default PersonalInfo;
