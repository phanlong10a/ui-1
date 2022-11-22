import { useTranslate } from '@/utils/hooks/useTranslate';

import Table, { ColumnsType } from 'antd/lib/table';
import { useEffect, useState } from 'react';
import { useIntl, useParams, useRequest } from 'umi';
import styles from '../index.less';
import { getDataPickupHistory } from '../service';
type Props = {};
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const PickupHistory = (props: Props) => {
  const { formatMessage } = useIntl();
  const params = useParams<{ id: string }>();

  const [infoPickUp, setInfoPickUp] = useState(null);
  useEffect(() => {
    const { id } = params;
    if (id) {
      pickupHistoryRequest.run(id);
    } else {
      setInfoPickUp(null);
    }
  }, [params]);
  const pickupHistoryRequest = useRequest(getDataPickupHistory, {
    manual: true,
    onSuccess(res: any) {
      const data = res.getItemPickUpHistory;
      setInfoPickUp(data);
    },
  });

  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      width: 100,
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
    },
    {
      title: 'const_column_pickup_time',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'const_column_pickup_code',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'const_column_pickup_item_name',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'const_column_pickup_position',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
    },
  ].map((item: any) => {
    return { ...item, title: formatMessage({ id: item.title }) };
  });
  return (
    <div className={styles.mainInfoUser}>
      <Table
        //@ts-ignore
        dataSource={infoPickUp}
        columns={columns}
        rowKey={(record) => record.key}
        locale={{ emptyText: formatMessage({ id: 'const_column_empty' }) }}
        scroll={{ x: 1000 }}
        // {...tableProps}
      />
    </div>
  );
};

export default PickupHistory;
