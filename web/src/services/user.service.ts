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
import { ApiPath } from '@src/constants';
import { ChangePassword, LoginUser, Preference, User } from '@src/types';
import { ApiKit } from '@src/utils';

const login = (user: LoginUser): Promise<string> => {
  return ApiKit.POST<string>(ApiPath.Login, user);
};

const logout = (): Promise<string> => {
  return ApiKit.GET<string>(ApiPath.Logout);
};

const saveUser = (user: User): Promise<User> => {
  return ApiKit.PUT<User>(ApiPath.User, user);
};

const savePreference = (preference: Preference): Promise<string> => {
  return ApiKit.PUT<string>(ApiPath.Preference, preference);
};

const getPreference = (): Promise<Preference> => {
  return ApiKit.GET<Preference>(ApiPath.Preference);
};

const changePassword = (changePassword: ChangePassword): Promise<string> => {
  return ApiKit.PUT<string>(ApiPath.ChangePassword, changePassword);
};

const getUser = (userId: number): Promise<User> => {
  return ApiKit.GET<User>(`${ApiPath.User}/${userId}`);
};

export default {
  login,
  logout,
  saveUser,
  getUser,
  getPreference,
  savePreference,
  changePassword,
};
