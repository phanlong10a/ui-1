import { ENVIRONMENTS, OPTION_STATUS_ACTIVE } from '@/utils/constant';
import { StatusAccount } from '@/utils/enum';
import { numberWithDots } from '@/utils/formatNumber';
import {
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useAntdTable, useToggle } from 'ahooks';
import {
  Breadcrumb,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
  Switch,
  Table,
  Tooltip,
} from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import React, { useState } from 'react';
import { useIntl, useHistory, useRequest } from 'umi';
import Dialog from './Components/Dialog';
import styles from './index.less';
import { getExcel, getTableData, switchStatusAdmin } from './service';

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
  const [idSelected, setIdSelected] = React.useState<number | string | null>(
    null,
  );
  const [form] = Form.useForm();

  const switchActiveRequest = useRequest(switchStatusAdmin, {
    manual: true,
    onSuccess() {
      search.submit();
    },
    onError() {
      search.submit();
    },
  });

  const history = useHistory();
  const { tableProps, search, params, refresh, error, loading } = useAntdTable(
    //@ts-ignore
    getTableData,
    {
      form,
      onError: (error: any) => {
        message.error(
          error.errors ? error.errors[0] : formatMessage({ id: 'error' }),
        );
      },
      onSuccess: () => {
        setTableVisible(true);
      },
    },
  );

  const { formatMessage } = useIntl();

  const { type, changeType, submit, reset } = search;

  const handleViewAdmin = (idAdmin: number | string) => {
    history.push('/admin-detail/' + idAdmin.toString());
  };
  const handleEditAdmin = (idAdmin: number | string, record: any) => {
    history.push('/department_edit/' + idAdmin + '/' + record);
  };
  const handleNewAdmin = () => {
    history.push('/department_new/');
  };
  const deleteAdmin = (isAdmin: number | string) => {
    setIdSelected(isAdmin);
    setOpenDialog.set(true);
  };
  const columns: ColumnsType<DataType> = [
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Mã nhân viên',
      dataIndex: 'staffCode',
      key: 'staffCode',
    },
    {
      title: 'Tổng số giờ làm việc',
      dataIndex: 'totalWork',
      key: 'totalWork',
    },
    {
      title: 'Bảo hiểm phải đóng',
      dataIndex: 'total_insurance',
      key: 'total_insurance',
      render(_, record: any) {
        return numberWithDots(record.total_insurance);
      },
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'cost_salary',
      key: 'cost_salary',
      render(_, record: any) {
        return numberWithDots(record.cost_salary);
      },
    },
    {
      title: 'Lương hoàn thành công việc',
      dataIndex: 'bonus_salary',
      key: 'bonus_salary',
      render(_, record: any) {
        return numberWithDots(record.bonus_salary);
      },
    },
    {
      title: 'Lương dự kiến',
      dataIndex: 'expected_salary',
      key: 'expected_salary',
      render(_, record: any) {
        return numberWithDots(record.expected_salary.toFixed(0));
      },
    },
    {
      title: 'Thuế thu nhập cá nhân dự kiến',
      dataIndex: 'expected_salary',
      key: 'expected_salary',
      render(_, record: any) {
        return numberWithDots(record.tax.toFixed(0));
      },
    },
  ];

  const searchForm = (
    <div className={styles.searchContainer}>
      <Form form={form} onFinish={() => submit()} className={styles.searchForm}>
        <Form.Item
          name="range"
          className={styles.searchItem}
          rules={[
            {
              required: true,
              message: 'Không được bỏ trống ',
            },
          ]}
        >
          <RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="staffCode"
          rules={[
            {
              required: true,
              message: 'Không được bỏ trống ',
            },
          ]}
          className={styles.searchItem}
        >
          <Input placeholder={'Nhập mã nhân viên'} allowClear />
        </Form.Item>

        <Form.Item
          name="total_day_worked"
          rules={[
            {
              required: true,
              message: 'Không được bỏ trống ',
            },
          ]}
          className={styles.searchItem}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={'Số ngày làm việc ước tính'}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">
          Tỉm kiếm
        </Button>
      </Form>
    </div>
  );

  const onExportExcel = () => {
    const value = form.getFieldsValue();
    getExcel(value).then(() => {
      window.open(
        ENVIRONMENTS.API_URL + '/output_excel/phieu_luong_du_kien.xlsx',
        'blank',
      );
    });
  };

  return (
    <>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>Danh sách lương nhân viên</Breadcrumb.Item>
      </Breadcrumb>
      {searchForm}
      {tableVisible && (
        <div className={styles.tableComponent}>
          {loading || error ? (
            <Skeleton active />
          ) : (
            <>
              <Button
                onClick={() => {
                  onExportExcel();
                }}
              >
                Xuất Phiếu lương nhân viên
              </Button>
              <Table
                {...tableProps}
                columns={columns}
                locale={{ emptyText: 'Trống' }}
                scroll={{ x: 1000 }}
              />
            </>
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
