import { LeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Card, Tabs } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link, useIntl, useParams, useRequest } from 'umi';
import KycInfo from './Components/KycInfo';
import PersonalInfo from './Components/PersonalInfo';
import PickupHistory from './Components/PickupHistory';
import SystemTree from './Components/SystemTree';
import UpdateHistory from './Components/UpdateHistory';
import styles from './index.less';
import { getOneUser } from './service';

interface InfoAccount {
  userId: string;
  email: string;
  full_name: string;
  phone: string;
  gender: string;
  status: string;
  date_of_birth?: any;
}
interface HistoryUpdate {
  stt?: any;
  dayUpdate: string;
  infoUpdate: string;
  byUpdate: string;
}
export default () => {
  const params = useParams<{ id: string }>();
  const [activeTabs, setActiveTabs] = React.useState(1);
  const [kycInfo, setKycInfo] = useState<any>(null);
  const [infoAccount, setInfoAccount] = useState<InfoAccount | null>(null);
  const [updateHis, setUpdateHis] = useState<HistoryUpdate[] | null>(null);

  const { formatMessage } = useIntl();

  useEffect(() => {
    const { id } = params;
    if (id) {
      getDataUser.run(id);
      history.run(id);
    } else {
      setInfoAccount(null);
    }
  }, [params]);
  const history = useRequest(getOneUser, {
    manual: true,
    onSuccess(res: any) {
      const dataRes = res.get_user_profile.update_history;
      setUpdateHis(dataRes);
    },
  });
  const getDataUser = useRequest(getOneUser, {
    manual: true,
    onSuccess(res: any) {
      const data = res.get_user_profile;
      const dataRes: InfoAccount = {
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        status: data.status,
        userId: data.userId,
        gender: data.user_profile?.gender,
        date_of_birth: data.user_profile?.date_of_birth
          ? moment(data.user_profile?.date_of_birth)
          : '',
      };
      setInfoAccount(dataRes);
      setKycInfo(data.user_identity);
    },
  });
  const renderTab = () => {
    switch (activeTabs) {
      case 1:
        return (
          <>
            <PersonalInfo infoAccount={infoAccount} getDataUser={getDataUser} />
          </>
        );
        break;
      case 2:
        return (
          <>
            <UpdateHistory updateHis={updateHis} />
          </>
        );
        break;
      case 3:
        return (
          <>
            <PickupHistory />
          </>
        );
        break;
      case 4:
        return (
          <>
            <SystemTree />
          </>
        );
        break;
      case 5:
        return (
          <>
            <KycInfo kycInfo={kycInfo} getDataUser={getDataUser} />
          </>
        );
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item>
          <Link to="/user-management" className={styles.previousLink}>
            <LeftOutlined />
          </Link>
          {formatMessage({ id: 'navigation_user_info' })}
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="primary-container">
        <Tabs
          defaultActiveKey="1"
          onChange={(key) => {
            setActiveTabs(parseInt(key));
          }}
          className="tab-on-card"
        >
          <Tabs.TabPane tab="Thông tin cá nhân" key="1"></Tabs.TabPane>
          <Tabs.TabPane tab="Lịch sử cập nhật" key="2"></Tabs.TabPane>
          <Tabs.TabPane tab="Lịch sử nhặt vật phẩm" key="3"></Tabs.TabPane>
          <Tabs.TabPane tab="Thống kê cây hệ thống" key="4"></Tabs.TabPane>
          <Tabs.TabPane tab="Thông tin KYC" key="5"></Tabs.TabPane>
        </Tabs>
        <Card className="card-after-tab" size="small">
          {renderTab()}
        </Card>
      </div>
    </>
  );
};
