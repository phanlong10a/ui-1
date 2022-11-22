import { ENVIRONMENTS } from '@/utils/constant';
import { useAuth } from '@/utils/hooks/useAuth';
import {
  AlignLeftOutlined,
  GiftOutlined,
  IdcardOutlined,
  LogoutOutlined,
  NotificationOutlined,
  SolutionOutlined,
  TeamOutlined,
  TransactionOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React from 'react';
import { useIntl, useLocation } from 'umi';

import { Link } from 'umi';
import styles from './index.less';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    children,
    label,
    icon,
  } as MenuItem;
}

const Sidebar = ({
  children,
  collapsed,
  onToggle,
}: {
  children?: React.ReactNode | React.ReactNode[];
  collapsed: boolean;
  onToggle: () => void;
}) => {
  const { formatMessage } = useIntl();
  const location = useLocation();
  const { onLogout } = useAuth();

  const renderLink: (link: string, title: string) => React.ReactNode = (
    link: string,
    title: string,
  ) => {
    return (
      <Link to={link} key={link}>
        {title}
      </Link>
    );
  };

  const items: MenuItem[] = [

    getItem(
      renderLink('/user', 'Quản lý user'),
      '/user',
      <IdcardOutlined />,
    ),
  ];
  // @ts-ignore
  const local = JSON.parse(
    // @ts-ignore
    localStorage.getItem(ENVIRONMENTS.LOCAL_STORAGE_KEY),
  );
  const userName = local?.display_name;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onToggle}
      trigger={null}
      className={styles.layoutSlider}
      breakpoint="md"
      width={250}
    >
      <div className={styles.logoWrapper}>
        <AlignLeftOutlined className={styles.toggleButton} onClick={onToggle} />
        {!collapsed && (
          <img src="/assets/images/main-logo.png" className={styles.logo} />
        )}
      </div>
      <div className={styles.sidebarAvatar}>
        <Avatar icon={<UserOutlined />} />
        {!collapsed && <span>{userName}</span>}
      </div>
      <Menu
        defaultSelectedKeys={[location.pathname]}
        mode="inline"
        items={items}
        className={styles.backgroundPrimary}
      />
      <div
        className={styles.logoutButton}
        onClick={() => {
          onLogout();
        }}
      >
        <LogoutOutlined size={24} />
        {!collapsed && <span>Đăng xuất</span>}
      </div>
    </Sider>
  );
};

export default Sidebar;
