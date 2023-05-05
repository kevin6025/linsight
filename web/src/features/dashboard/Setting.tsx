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
import React, { useEffect, useRef } from 'react';
import { Tabs, TabPane, Card, Form } from '@douyinfe/semi-ui';
import { DashboardStore } from '@src/stores';
import VariableList from './components/VariableList';

const GeneralForm: React.FC = () => {
  const { dashboard } = DashboardStore;
  const formApi = useRef<any>();

  useEffect(() => {
    if (formApi.current) {
      formApi.current.setValues(dashboard);
    }
  }, [dashboard]);

  return (
    <Form
      labelPosition="top"
      style={{ maxWidth: 650 }}
      getFormApi={(api: any) => (formApi.current = api)}
      onValueChange={(values: any) => DashboardStore.updateDashboardProps(values)}>
      <Form.Input label="Title" field="title" />
    </Form>
  );
};

const Setting: React.FC<{}> = () => {
  return (
    <Card className="linsight-feature dashboard-setting">
      <Tabs tabPosition="left" defaultActiveKey={'variables'}>
        <TabPane tab="General" itemKey="general">
          <GeneralForm />
        </TabPane>
        <TabPane tab="Variables" itemKey="variables">
          <VariableList />
        </TabPane>
        <TabPane tab="Permissions" itemKey="permissions">
          permissions
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Setting;
