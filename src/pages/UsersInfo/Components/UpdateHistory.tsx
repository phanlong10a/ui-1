import Table, { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useIntl, useParams, useRequest } from 'umi';
import styles from '../index.less';
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const UpdateHistory = ({ updateHis }: any) => {
  const { formatMessage } = useIntl();

  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      width: 100,
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
      render(_: any, record: any, index: number) {
        return index + 1;
      },
    },
    {
      title: 'const_column_update_time',
      dataIndex: 'update_at',
      key: 'update_at',
      render(_: any, record: any) {
        return moment(record.update_at).format('DD/MM/YYYY');
      },
    },
    {
      title: 'const_column_update_info',
      dataIndex: 'new_value',
      key: 'new_value',
      render(_: any, record: any) {
        if (record?.update_field === 'date_of_birth') {
          return (
            <>
              {record.old_value
                ? moment(record.old_value).format('DD/MM/YYYY') + ' > '
                : ''}
              {record.new_value
                ? moment(record.new_value).format('DD/MM/YYYY')
                : ''}
            </>
          );
        } else {
          return (
            <>
              {record.old_value ? record.old_value + ' > ' : ''}
              {record.new_value ? record.new_value : ''}
            </>
          );
        }
      },
    },
    {
      title: 'const_column_update_by',
      dataIndex: 'author',
      key: 'author',
    },
  ].map((item: any) => {
    return { ...item, title: formatMessage({ id: item.title }) };
  });
  return (
    <div className={styles.mainInfoUser}>
      <Table
        columns={columns}
        rowKey={(record) => record.key}
        locale={{ emptyText: formatMessage({ id: 'const_column_empty' }) }}
        scroll={{ x: 1000 }}
        dataSource={updateHis}
      />
    </div>
  );
};

export default UpdateHistory;
