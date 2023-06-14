// Licensed to LinDB under one or more contributor
// license agreements. See the NOTICE file distributed with
// this work for additional information regarding copyright
// ownership. LinDB licenses this file to you under
// the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

package service

import (
	"fmt"
	"testing"

	gomock "github.com/golang/mock/gomock"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"

	"github.com/lindb/linsight/model"
	"github.com/lindb/linsight/pkg/db"
	"github.com/lindb/linsight/pkg/util"
)

func TestUserService_GetPreference(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := db.NewMockDB(ctrl)

	srv := NewUserService(mockDB)
	t.Run("get user's preference successfully", func(t *testing.T) {
		mockDB.EXPECT().Get(gomock.Any(), "org_id=? and user_id=?", int64(12), int64(10)).Return(nil)
		pref, err := srv.GetPreference(ctx)
		assert.NotNil(t, pref)
		assert.NoError(t, err)
	})
}

func TestUserService_SavePreference(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := db.NewMockDB(ctrl)
	srv := NewUserService(mockDB)
	cases := []struct {
		name    string
		prepare func()
		wantErr bool
	}{
		{
			name: "get user's preference failure",
			prepare: func() {
				mockDB.EXPECT().Get(gomock.Any(), "org_id=? and user_id=?", int64(12), int64(10)).Return(fmt.Errorf("err"))
			},
			wantErr: true,
		},
		{
			name: "update user's preference failure",
			prepare: func() {
				mockDB.EXPECT().Get(gomock.Any(), "org_id=? and user_id=?", int64(12), int64(10)).Return(nil)
				mockDB.EXPECT().Update(gomock.Any(), "org_id=? and user_id=?", int64(12), int64(10)).Return(fmt.Errorf("err"))
			},
			wantErr: true,
		},
		{
			name: "update user's preference successfully",
			prepare: func() {
				mockDB.EXPECT().Get(gomock.Any(), "org_id=? and user_id=?", int64(12), int64(10)).Return(nil)
				mockDB.EXPECT().Update(gomock.Any(), "org_id=? and user_id=?", int64(12), int64(10)).Return(nil)
			},
			wantErr: false,
		},
		{
			name: "create user's preference successfully",
			prepare: func() {
				mockDB.EXPECT().Get(gomock.Any(), "org_id=? and user_id=?", int64(12), int64(10)).Return(gorm.ErrRecordNotFound)
				mockDB.EXPECT().Create(gomock.Any()).Return(nil)
			},
			wantErr: false,
		},
	}

	for _, tt := range cases {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			tt.prepare()
			err := srv.SavePreference(ctx, &model.Preference{})
			if tt.wantErr != (err != nil) {
				t.Fatal(tt.name)
			}
		})
	}
}

func TestUserSerivce_ChangePassword(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockDB := db.NewMockDB(ctrl)
	srv := NewUserService(mockDB)
	cases := []struct {
		name    string
		prepare func()
		wantErr bool
	}{
		{
			name: "get user failure",
			prepare: func() {
				mockDB.EXPECT().Get(gomock.Any(), "id=?", int64(10)).Return(fmt.Errorf("err"))
			},
			wantErr: true,
		},
		{
			name: "old password invalid",
			prepare: func() {
				mockDB.EXPECT().Get(gomock.Any(), "id=?", int64(10)).Return(nil)
			},
			wantErr: true,
		},
		{
			name: "change password successfully",
			prepare: func() {
				mockDB.EXPECT().Get(gomock.Any(), "id=?", int64(10)).DoAndReturn(func(m any, s string, _ int64) error {
					fmt.Println(m)
					fmt.Println(s)
					user := m.(*model.User)
					user.Password = util.EncodePassword("12345", user.Salt)
					user.ID = 10
					return nil
				})
				mockDB.EXPECT().Update(gomock.Any(), "id=?", int64(10)).Return(nil)
			},
			wantErr: false,
		},
	}

	for _, tt := range cases {
		tt := tt
		t.Run(tt.name, func(t *testing.T) {
			tt.prepare()
			err := srv.ChangePassword(ctx, &model.ChangeUserPassword{
				OldPassword: "12345",
				NewPassword: "123456",
			})
			if tt.wantErr != (err != nil) {
				t.Fatal(tt.name)
			}
		})
	}
}
