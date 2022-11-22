import Table, { ColumnsType } from 'antd/lib/table';
import { useIntl } from 'umi';
import styles from '../index.less';
type Props = {};
interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

const mockData: DataType[] = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];
const SystemTree = (props: Props) => {
  const { formatMessage } = useIntl();
  const columns: ColumnsType<DataType> = [
    {
      title: 'Cấp F',
      width: 100,
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
    },
    {
      title: 'Mã',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Họ Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Cấp hoa hồng',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  // .map((item: any) => {
  //   return { ...item, title: formatMessage({ id: item.title }) };
  // });
  return (
    <div className={styles.mainInfoUser}>
      <Table
        //@ts-ignore
        columns={columns}
        rowKey={(record) => record.key}
        locale={{ emptyText: formatMessage({ id: 'const_column_empty' }) }}
        scroll={{ x: 1000 }}
        dataSource={mockData}
        // {...tableProps}
      />
    </div>
  );
};

export default SystemTree;
