import { STATUS_KYC } from '@/utils/constant';
import { StatusKyc } from '@/utils/enum';
import { useTranslate } from '@/utils/hooks/useTranslate';
import { useToggle } from 'ahooks';
import { Button, Card, Col, Image, Modal, Row, Skeleton } from 'antd';
import moment from 'moment';
import { useIntl, useParams, useRequest } from 'umi';
import styles from '../index.less';
import { handleKycService } from '../service';

export default ({ kycInfo, getDataUser }: any) => {
  const [rejectDialog, setRejectDialog] = useToggle(false);

  const { t } = useTranslate();
  console.log('🚀 ~ file: KycInfo.tsx ~ line 8 ~ kycInfo', kycInfo);
  const params = useParams<{ id: string }>();
  const { formatMessage } = useIntl();

  const requestHandleKyc = useRequest(handleKycService, {
    manual: true,
    onSuccess(res) {
      getDataUser.refresh();
    },
  });

  const handleKyc = (
    userId: number | string,
    isAccept: boolean,
    reason?: string,
  ) => {
    requestHandleKyc.run(userId, isAccept, reason);
  };
  const handleAcceptUser = (idUser: number | string) => {
    Modal.confirm({
      icon: null,
      content: 'Bạn có chắc chắn muốn phê duyệt tài khoản này không?',
      okText: formatMessage({ id: 'general_accept' }),
      cancelText: formatMessage({ id: 'general_cancel' }),
      onOk() {
        handleKyc(idUser, true);
      },
    });
  };
  return (
    <>
      {params.id && !kycInfo ? (
        <Skeleton active />
      ) : (
        <Card
          title={formatMessage({ id: 'general_personal_info' })}
          size="small"
          className={styles.primaryCard}
        >
          <div>
            {formatMessage({ id: 'fullname' })} : {kycInfo.full_name}
          </div>
          <div>
            {formatMessage({ id: 'address' })} : {kycInfo.address}{' '}
          </div>
          <div>
            {formatMessage({ id: 'date_of_birth' })} :{' '}
            {kycInfo.date_of_birth
              ? moment(kycInfo.date_of_birth).format('DD/MM/YYYY')
              : ''}
          </div>
          <div>
            {formatMessage({ id: 'general_kyc_type_IDcard' })}/
            {formatMessage({ id: 'general_kyc_type_passport' })} :{' '}
            {kycInfo.type_identity}{' '}
          </div>
          <div>
            {formatMessage({ id: 'date_provided' })} :{' '}
            {kycInfo.date_of_issue
              ? moment(kycInfo.date_of_issue).format('DD/MM/YYYY')
              : ''}
          </div>
          <div>
            {formatMessage({ id: 'place_of_issue' })} : {kycInfo.place_of_issue}
          </div>
          <div>
            {formatMessage({ id: 'status' })} :{' '}
            {kycInfo.verification_status
              ? formatMessage({
                  id:
                    STATUS_KYC.find(
                      (i) => i.value === kycInfo.verification_status,
                    )?.name || '',
                })
              : ''}
          </div>
        </Card>
      )}
      {params.id && !kycInfo ? (
        <Skeleton active />
      ) : (
        <Card
          title={formatMessage({ id: 'picture_verified' })}
          size="small"
          className={styles.primaryCard}
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <div className={styles.verifiedImage}>
                {kycInfo.identity_front ? (
                  <Image
                    wrapperClassName={styles.antImage}
                    src={'http://' + kycInfo.identity_front}
                  />
                ) : (
                  <Skeleton active />
                )}
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <div className={styles.verifiedImage}>
                {kycInfo.identity_backside ? (
                  <Image
                    wrapperClassName={styles.antImage}
                    src={'http://' + kycInfo.identity_backside}
                  />
                ) : (
                  <Skeleton active />
                )}
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <div className={styles.verifiedImage}>
                {kycInfo.verify_image ? (
                  <Image
                    wrapperClassName={styles.antImage}
                    src={'http://' + kycInfo.verify_image}
                  />
                ) : (
                  <Skeleton active />
                )}
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {kycInfo.verification_status === StatusKyc.PENDING && (
        <Row
          align="middle"
          justify="center"
          className={styles.submitButtonGroup}
        >
          <Col>
            <Button
              danger
              onClick={() => setRejectDialog.set(true)}
              className={styles.addButton}
            >
              {t('general_denied_kyc')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleAcceptUser(kycInfo.userId);
              }}
              className={styles.addButton}
            >
              {t('general_accept_kyc')}
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};
