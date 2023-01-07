import { Button, Col, message, Row } from 'antd';
import React from 'react';
import { history } from 'umi';
import styles from './index.less';

import { API_PATH, privateRequest, request } from '@/utils/apis';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { useRequest, useToggle } from 'ahooks';
import { onSubmitValue } from './service';
import moment from 'moment';

export default () => {
  const [data, setData] = React.useState<any>(null);
  console.log('🚀 ~ file: index.tsx:16 ~ data', data);

  const initValue = useRequest(onSubmitValue, {
    onSuccess(data: any) {
      if (data.errors) {
        message.error('Thất bại');
      } else {
        setData(data);
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

  const onCheckin = async () => {
    const res = await privateRequest(request.post, API_PATH.checkin);
    initValue.refresh();
    message.success(res.message);
  };
  const onCheckout = async () => {
    const res = await privateRequest(request.post, API_PATH.checkout);
    initValue.refresh();
    message.success(res.message);
  };

  return (
    data && (
      <>
        <Row>
          <Col>
            {!data.data.checkin ? (
              <Button
                type="primary"
                onClick={onCheckin}
                className={styles.addButton}
              >
                Checkin
              </Button>
            ) : !data.data.checkout ? (
              <Button
                type="dashed"
                onClick={onCheckout}
                className={styles.addButton}
              >
                Checkout
              </Button>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        {!!data.data.checkin && (
          <Row style={{ marginTop: 16 }}>
            <Col>
              Thời gian checkin{' '}
              {moment(data.data.checkin).format('YYYY-MM-DD HH:mm')}
            </Col>
          </Row>
        )}
        {!!data.data.checkout && (
          <Row style={{ marginTop: 16 }}>
            <Col>
              Thời gian checkout{' '}
              {moment(data.data.checkout).format('YYYY-MM-DD HH:mm')}
            </Col>
          </Row>
        )}
        <Row style={{ marginTop: 16 }}>
          <Col>Số giờ làm việc trong ngày: {data.total_hours}h</Col>
        </Row>
      </>
    )
  );
};
