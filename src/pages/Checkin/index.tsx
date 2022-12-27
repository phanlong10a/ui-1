import {
  Button, Form, message
} from 'antd';
import React from 'react';
import { history, useParams } from 'umi';
import styles from './index.less';

import { API_PATH, privateRequest, request } from '@/utils/apis';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { useRequest, useToggle } from 'ahooks';
import { onEditValue, onSubmitValue } from './service';

export default () => {

  const params: any = useParams()

  const [form] = Form.useForm();
  const [currentData, setCurrentData] = React.useState<any>(null)
  const [load, setLoad] = React.useState<any>(true)

  React.useEffect(() => {
    if (params.id) {
      setCurrentData(params.name)
      setLoad(false)
    } else {
      setLoad(false)
    }
  }, [params, params?.id])


  const requestCreateDep = useRequest(onSubmitValue, {
    manual: true,
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Thất bại');
      } else {
        history.push('/department');
        message.success('Thành công');
      }
    },
  });
  const requestEditDep = useRequest(onEditValue, {
    manual: true,
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Thất bại');
      } else {
        history.push('/department');
        message.success('Thành công');
      }
    },
  });

  const { t } = useTranslate();
  const [openDialog, setOpenDialog] = useToggle(false);
  const [idSelected, setIdSelected] = React.useState<number | string | null>(
    null,
  );
  const handleDelete = () => {
    setOpenDialog.set(true);
  };

  const onFinish = (values: any) => {
    const data = {
      ...values
    };
    if (!!params.id) {
      requestEditDep.run(data, params.id);
    } else {
      requestCreateDep.run(data);
    }
  };
  const onCheckin = async () => {
    const res = await privateRequest(request.post, API_PATH.checkin)
    message.success(res.message)
  }
  const onCheckout = async () => {
    const res = await privateRequest(request.post, API_PATH.checkout)
    message.success(res.message)
  }

  return (
    <>
      <Button

        type="primary"
        onClick={onCheckin}
        className={styles.addButton}
      >
        Checkin
      </Button>
      <Button
        type="dashed"
        onClick={onCheckout}
        className={styles.addButton}
      >
        Checkout
      </Button>
    </>
  );
};
