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

package api

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/golang/mock/gomock"
	"github.com/lindb/common/pkg/encoding"
	"github.com/stretchr/testify/assert"

	"github.com/lindb/linsight/http/deps"
	"github.com/lindb/linsight/model"
	"github.com/lindb/linsight/service"
)

func init() {
	gin.SetMode(gin.ReleaseMode)
}

func TestChartAPI_CreateChart(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	chartSrv := service.NewMockChartService(ctrl)
	r := gin.New()
	api := NewChartAPI(&deps.API{
		ChartSrv: chartSrv,
	})
	r.POST("/charts", api.CreateChart)
	body := encoding.JSONMarshal(&model.Chart{})

	cases := []struct {
		name    string
		body    io.Reader
		prepare func()
		assert  func(resp *httptest.ResponseRecorder)
	}{
		{
			name: "cannot get params",
			body: http.NoBody,
			assert: func(resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusInternalServerError, resp.Code)
			},
		},
		{
			name: "create chart failure",
			body: bytes.NewBuffer(body),
			prepare: func() {
				chartSrv.EXPECT().CreateChart(gomock.Any(), gomock.Any()).Return("", fmt.Errorf("err"))
			},
			assert: func(resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusInternalServerError, resp.Code)
			},
		},
		{
			name: "create chart successfully",
			body: bytes.NewBuffer(body),
			prepare: func() {
				chartSrv.EXPECT().CreateChart(gomock.Any(), gomock.Any()).Return("1234", nil)
			},
			assert: func(resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, resp.Code)
				assert.Equal(t, `"1234"`, resp.Body.String())
			},
		},
	}
	for _, tt := range cases {
		tt := tt
		t.Run(tt.name, func(_ *testing.T) {
			req, _ := http.NewRequestWithContext(context.TODO(), http.MethodPost, "/charts", tt.body)
			req.Header.Set("content-type", "application/json")
			resp := httptest.NewRecorder()
			if tt.prepare != nil {
				tt.prepare()
			}
			r.ServeHTTP(resp, req)
			tt.assert(resp)
		})
	}
}

func TestChartAPI_SearchCharts(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	chartSrv := service.NewMockChartService(ctrl)
	r := gin.New()
	api := NewChartAPI(&deps.API{
		ChartSrv: chartSrv,
	})
	r.PUT("/charts", api.SearchCharts)
	params := encoding.JSONMarshal(&model.SearchChartRequest{})

	cases := []struct {
		name    string
		body    io.Reader
		prepare func()
		assert  func(resp *httptest.ResponseRecorder)
	}{
		{
			name: "cannot get params",
			body: bytes.NewBuffer([]byte("{abc")),
			assert: func(resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusInternalServerError, resp.Code)
			},
		},
		{
			name: "search chart failure",
			body: bytes.NewBuffer(params),
			prepare: func() {
				chartSrv.EXPECT().SearchCharts(gomock.Any(), gomock.Any()).Return(nil, int64(0), fmt.Errorf("err"))
			},
			assert: func(resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusInternalServerError, resp.Code)
			},
		},
		{
			name: "search chart successfully",
			body: bytes.NewBuffer(params),
			prepare: func() {
				chartSrv.EXPECT().SearchCharts(gomock.Any(), gomock.Any()).Return(nil, int64(0), nil)
			},
			assert: func(resp *httptest.ResponseRecorder) {
				assert.Equal(t, http.StatusOK, resp.Code)
			},
		},
	}
	for _, tt := range cases {
		tt := tt
		t.Run(tt.name, func(_ *testing.T) {
			req, _ := http.NewRequestWithContext(context.TODO(), http.MethodPut, "/charts", tt.body)
			req.Header.Set("content-type", "application/json")
			resp := httptest.NewRecorder()
			if tt.prepare != nil {
				tt.prepare()
			}
			r.ServeHTTP(resp, req)
			tt.assert(resp)
		})
	}
}
