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
import { makeAutoObservable, toJS } from 'mobx';
import { DatasourceInstance, DatasourceRepositoryInst, DatasourceSetting } from '@src/types';
import { find } from 'lodash-es';

class DatasourceStore {
  datasources: DatasourceInstance[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * return datasource by uid
   * @param uid datasource uid
   * @return if find return DatasourceInstance else return null
   */
  getDatasource(uid: string): DatasourceInstance | null {
    const ds = find(this.datasources, (item: DatasourceInstance) => {
      return item.setting.uid == uid;
    });
    if (ds) {
      return toJS(ds);
    }
    return null;
  }

  setDatasources(settings: DatasourceSetting[]) {
    const rs: DatasourceInstance[] = [];
    (settings || []).forEach((setting: DatasourceSetting) => {
      const plugin = DatasourceRepositoryInst.get(setting.type);
      console.log('set dataosurce...', setting, plugin);
      if (plugin) {
        rs.push({
          setting: setting,
          plugin: plugin,
          api: new plugin.DSConstructor(setting),
        });
      }
    });
    this.datasources = rs;
  }

  async sync() {
    // FIXME: remove it or add sync logic
    // const datasources = await DataSourceSrv.fetchDataSources();
    // (datasources || []).forEach((ds: DataSourceSetting) => {
    //   const plugin = DataSourceRepositoryInst.get(ds.type);
    //   if (plugin) {
    //     plugin.api = new plugin.DSConstructor(ds);
    //     ds.plugin = plugin;
    //   }
    // });
    // console.log(datasources, 'sync');
    // this.datasources = datasources;
  }
}

export default new DatasourceStore();
