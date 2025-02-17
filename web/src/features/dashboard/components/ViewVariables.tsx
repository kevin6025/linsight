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
import { Card, Form, useFormApi } from '@douyinfe/semi-ui';
import { DashboardStore } from '@src/stores';
import React, { useEffect } from 'react';
import { get, isEmpty, map } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { VariableHideType } from '@src/types';
import './variables.scss';
import { useSearchParams } from 'react-router-dom';

/*
 * View variable based on setting.
 */
const ViewVariable: React.FC<{ variable: any }> = (props) => {
  const { variable } = props;
  const [searchParams] = useSearchParams();
  const formApi = useFormApi();

  useEffect(() => {
    const name = variable.name;
    const value = searchParams.get(name);
    formApi.setValue(name, value);
  }, [searchParams, variable, formApi]);

  if (variable.hide === VariableHideType.Hide) {
    return null;
  }

  return (
    <Form.Select
      showClear
      key={variable.name}
      noLabel={variable.hide === VariableHideType.OnlyValue}
      label={variable.label}
      field={variable.name}
      optionList={[
        { value: 'value1', label: 'value1' },
        { value: 'value2', label: 'value2' },
      ]}
    />
  );
};

/*
 * View the list of variables
 */
const ViewVariables: React.FC<{ className?: string }> = (props) => {
  const { className } = props;
  const { dashboard } = DashboardStore;
  const [searchParams, setSearchParams] = useSearchParams();
  const variables: any[] = get(dashboard, 'config.variables', []);
  if (isEmpty(variables)) {
    return null;
  }
  // get all variables' name
  const names = map(variables, (item: any) => item.name);

  return (
    <Card className={className} bodyStyle={{ padding: 8 }}>
      <Form
        labelPosition="inset"
        layout="horizontal"
        className="lin-variables"
        onValueChange={(values: any) => {
          if (isEmpty(names)) {
            return;
          }
          // set variables to url params
          names.forEach((name: string) => {
            const val = get(values, name);
            if (isEmpty(val)) {
              searchParams.delete(name);
            } else {
              searchParams.set(name, val);
            }
          });
          setSearchParams(searchParams);
        }}>
        {variables.map((item: any, index: number) => (
          <ViewVariable variable={item} key={index} />
        ))}
      </Form>
    </Card>
  );
};

export default observer(ViewVariables);
