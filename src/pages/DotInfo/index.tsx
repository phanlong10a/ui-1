import { useAntdTable, useToggle } from 'ahooks';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Skeleton,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import React, { useState } from 'react';
import { useHistory, useIntl, useRequest } from 'umi';
import Dialog from './Components/Dialog';
import styles from './index.less';
import { getTableData, switchStatusAdmin } from './service';

interface DataType {
  key: string;
  stt: number;
  full_name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  status: string;
}

const { RangePicker } = DatePicker;

export default () => {
  const [openDialog, setOpenDialog] = useToggle(false);
  const [tableVisible, setTableVisible] = useState(false);
  const [username, setUserName] = useState(null);
  const [idSelected, setIdSelected] = React.useState<number | string | null>(
    null,
  );
  const [form] = Form.useForm();

  const history = useHistory();
  const { tableProps, search, params, refresh, error, loading } = useAntdTable(
    //@ts-ignore
    getTableData,
    {
      form,
      onSuccess(data: any, params) {
        setUserName(data?.name);
      },
      onError: (error: any) => {
        message.error(
          error.errors ? error.errors[0] : formatMessage({ id: 'error' }),
        );
      },
    },
  );

  const { formatMessage } = useIntl();

  const { type, changeType, submit, reset } = search;

  const columns: ColumnsType<DataType> = [
    {
      title: 'STT',
      width: 100,
      dataIndex: 'stt',
      key: 'stt',
      align: 'center',
    },
    {
      title: 'Tên nhân viên',
      dataIndex: ['user', 'fullname'],
      key: 'fullname',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: ['user', 'staffCode'],
      key: 'staffCode',
    },
    {
      title: ' Ngày ',
      dataIndex: 'day',
      key: 'day',
      render: (_: any, record: any) => {
        return record?.data?.checkin
          ? moment(record?.data?.checkin).format('YYYY/MM/DD')
          : '';
      },
    },
    {
      title: 'Giờ vào',
      dataIndex: 'salary',
      key: 'salary',
      render: (_: any, record: any) => {
        return record?.data?.checkin
          ? moment(record?.data?.checkin).format('HH:mm:ss')
          : '';
      },
    },
    {
      title: 'Giờ ra',
      dataIndex: 'timeout',
      key: 'timeout',
      render: (_: any, record: any) => {
        return record?.data?.checkout
          ? moment(record?.data?.checkout).format('HH:mm:ss')
          : '';
      },
    },
    {
      title: 'Tổng số giờ làm',
      dataIndex: ['total_hours'],
      key: 'total_hours',
    },
  ];

  const searchForm = (
    <div className={styles.searchContainer}>
      <Form form={form} className={styles.searchForm}>
        <Form.Item name="range" className={styles.searchItem}>
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="staffCode" className={styles.searchItem}>
          <Input placeholder={'Nhập mã nhân viên'} allowClear required />
        </Form.Item>

        <Button
          type="primary"
          onClick={() => {
            submit();
            setTableVisible(true);
          }}
        >
          Tỉm kiếm
        </Button>
      </Form>
    </div>
  );

  return (
    <>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Xem chấm công</Breadcrumb.Item>
      </Breadcrumb>
      {searchForm}
      {tableVisible && (
        <div className={styles.tableComponent}>
          <div>Nhân viên:{username}</div>
          {loading || error ? (
            <Skeleton active />
          ) : (
            <Table
              {...tableProps}
              columns={columns}
              locale={{ emptyText: 'Trống' }}
              scroll={{ x: 1000 }}
            />
          )}
        </div>
      )}
      {openDialog && (
        <Dialog
          open={openDialog}
          setOpen={(b) => {
            setOpenDialog.set(b);
            refresh();
          }}
          itemEdit={idSelected}
        />
      )}
    </>
  );
};
