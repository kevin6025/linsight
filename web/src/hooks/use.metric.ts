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
import { DatasourceStore } from '@src/stores';
import { Query } from '@src/types';
import { isEmpty } from 'lodash-es';
import { toJS } from 'mobx';
import { useRequest } from './use.request';

export const useMetric = (queries: Query[]) => {
  console.log('use metric.......', toJS(queries));
  const { result, loading, refetch, error } = useRequest(
    ['search_metric_data', queries],
    async () => {
      const requests: any[] = [];
      (queries || []).forEach((query: Query) => {
        console.log(toJS(query), 'query.....');
        const ds = DatasourceStore.getDatasource(query.datasource.uid);
        if (!ds) {
          return;
        }
        // add query request into batch
        requests.push(ds.api.query(query.request));
      });
      return Promise.allSettled(requests).then((res) => {
        return res.map((item) => (item.status === 'fulfilled' ? item.value : [])).flat();
      });
    },
    { enabled: !isEmpty(queries) }
  );
  return {
    loading,
    result,
    error,
    refetch,
  };
};
