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
import React from 'react';
import { Button, Card, Divider, Input, List, Typography } from '@douyinfe/semi-ui';
import { IconSearchStroked, IconPlusStroked, IconDeleteStroked } from '@douyinfe/semi-icons';
import { DatasourceSrv } from '@src/services';
import { DatasourceRepositoryInst, DatasourceSetting } from '@src/types';
import { isEmpty } from 'lodash-es';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { StatusTip } from '@src/components';
import { useRequest } from '@src/hooks';

const { Title, Text } = Typography;

const ListDataSource: React.FC = () => {
  const navigate = useNavigate();
  const { result, loading, error } = useRequest(['list_datasources'], () => DatasourceSrv.fetchDatasources());
  return (
    <Card className="linsight-feature">
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <Input prefix={<IconSearchStroked />} placeholder="Filter datasources" />
        <Button icon={<IconPlusStroked />} onClick={() => navigate('/setting/datasource')}>
          New
        </Button>
      </div>
      <List
        bordered
        dataSource={result}
        emptyContent={<StatusTip isLoading={loading} isEmpty={isEmpty(result)} error={error} />}
        renderItem={(ds: DatasourceSetting) => {
          const item = DatasourceRepositoryInst.get(ds.type);
          return (
            <List.Item
              key={ds.uid}
              header={<img src={`${item?.darkLogo}`} width={48} />}
              extra={<Button type="danger" icon={<IconDeleteStroked />} />}
              main={
                <div
                  style={{ cursor: 'pointer', width: '100%' }}
                  onClick={() =>
                    navigate({
                      pathname: '/setting/datasource',
                      search: `${createSearchParams({
                        uid: ds.uid,
                      })}`,
                    })
                  }>
                  <Title heading={5}>{ds.name}</Title>
                  <div style={{ marginTop: 8 }}>
                    <Text>{item?.Name}</Text>
                    <Divider layout="vertical" style={{ margin: '0 8px' }} />
                    <Text>{ds.url}</Text>
                  </div>
                </div>
              }
            />
          );
        }}
      />
    </Card>
  );
};

export default ListDataSource;
