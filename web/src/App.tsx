/*
Licensed to LinDB under one or more contributor
license agreements. See the NOTICE file distributed with
this work for additional information regarding copyright
ownership. LinDB licenses this file to you under
the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
 
Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/
import React, { useContext, useEffect } from 'react';
import { Layout, Nav, Dropdown, Divider, Typography } from '@douyinfe/semi-ui';
import { IconLeftCircleStroked, IconUser, IconMoon, IconSun } from '@douyinfe/semi-icons';
import * as _ from 'lodash-es';
import { Footer, Icon } from '@src/components';
import { PlatformContext } from '@src/contexts';
import { Feature, FeatureRepositoryInst, ThemeType } from '@src/types';
import { UserSrv } from './services';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MenuStore } from './stores';
import DarkLogo from '@src/images/logo-dark.svg';
import Logo from '@src/images/logo.svg';

const { Text } = Typography;
const { Sider, Content } = Layout;

const FeatureMenu: React.FC = () => {
  const { boot, collapsed, toggleCollapse, toggleTheme, theme } = useContext(PlatformContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    MenuStore.setCurrentMenu(location.pathname);
  }, [location]);

  const selectMenus = (): string[] => {
    let menu: string[] = [];
    (boot.navTree || []).forEach((item: any) => {
      if (item.children) {
        const subItem = _.find(item.children, { path: location.pathname });
        if (subItem) {
          menu.push(subItem.path || subItem.text);
          return;
        }
      } else if (item.path === location.pathname) {
        menu.push(item.path || item.text);
        return;
      }
    });
    return menu;
  };

  const renderMenus = (menus: any) => {
    console.log('xxxxxxx render menu', boot, menus);
    return (menus || []).map((item: any) => {
      if (item.children) {
        return (
          <Nav.Sub
            key={item.text}
            level={0}
            itemKey={item.path || item.text}
            icon={<Icon icon={item.icon} style={{ fontSize: 20 }} />}
            text={item.text}>
            {item.children.map((child: any) => (
              <Nav.Item
                level={1}
                key={`${child.text}item`}
                icon={<Icon icon={child.icon} style={{ fontSize: 20 }} />}
                text={child.text}
                itemKey={child.path || child.text}
                onClick={() => navigate(child.path)}
              />
            ))}
          </Nav.Sub>
        );
      }

      if (collapsed) {
        return (
          <Nav.Sub
            level={0}
            key={item.text}
            itemKey={item.path || item.text}
            icon={<Icon icon={item.icon} style={{ fontSize: 20 }} />}
            text={item.text}>
            <Nav.Item
              level={1}
              icon={<Icon icon={item.icon} style={{ fontSize: 20 }} />}
              itemKey={item.path || item.text}
              key={`${item.text}item`}
              text={item.text}
              onClick={() => navigate(item.path)}
            />
          </Nav.Sub>
        );
      }
      return (
        <Nav.Item
          level={0}
          icon={<Icon icon={item.icon} style={{ fontSize: 20 }} />}
          itemKey={item.path || item.text}
          key={`${item.text}item`}
          text={item.text}
          onClick={() => navigate(item.path)}
        />
      );
    });
  };

  return (
    <>
      <div className="nav-menu-no-icon"></div>
      <Sider className="linsight-sider">
        <Nav
          subNavMotion={false}
          limitIndent={true}
          isCollapsed={collapsed}
          getPopupContainer={(): any => {
            return document.querySelector('.nav-menu-no-icon');
          }}
          selectedKeys={selectMenus()}
          style={{ maxWidth: 220, height: '100%' }}
          header={{
            logo: theme === ThemeType.Dark ? <img src={DarkLogo} /> : <img src={Logo} />,
            text: 'insight',
          }}
          footer={{
            children: (
              <div className="linsight-nav-footer">
                <Divider>
                  <IconLeftCircleStroked
                    className="linsight-collapse-btn"
                    onClick={toggleCollapse}
                    rotate={collapsed ? 180 : 0}
                    size="large"
                  />
                </Divider>
                <Dropdown
                  spacing={8}
                  position="right"
                  render={
                    <Dropdown.Menu className="linsight-user">
                      <Dropdown.Item disabled>
                        {_.get(boot, 'user.name')}@{_.get(boot, 'user.org.name')}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={() => navigate('/setting/user/edit')}>Personal Settings</Dropdown.Item>
                      <Dropdown.Item icon={theme !== ThemeType.Dark ? <IconMoon /> : <IconSun />} onClick={toggleTheme}>
                        {_.upperFirst(theme)}
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        type="danger"
                        icon={<Icon icon="icon-signout" />}
                        onClick={async () => {
                          await UserSrv.logout();
                          navigate('/login');
                        }}>
                        Sign out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  }>
                  <div
                    className="user"
                    style={collapsed ? { justifyContent: 'center' } : { justifyContent: 'start', paddingLeft: 12 }}>
                    <IconUser size="large" />
                    {!collapsed && (
                      <Text ellipsis style={{ width: 160 }}>
                        {_.get(boot, 'user.name')}
                      </Text>
                    )}
                  </div>
                </Dropdown>
              </div>
            ),
          }}>
          {renderMenus(boot.navTree)}
        </Nav>
      </Sider>
    </>
  );
};

const App: React.FC = () => {
  const features = FeatureRepositoryInst.getFeatures();
  console.log('app features', features);
  return (
    <Layout className="linsight">
      <FeatureMenu />
      <Layout>
        <Content>
          <Routes>
            {features.map((feature: Feature) => {
              const Component = feature.Component;
              return <Route key={feature.Route} path={feature.Route} element={<Component />} />;
            })}
          </Routes>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default App;
