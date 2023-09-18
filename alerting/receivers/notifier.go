package receivers

import (
	"context"

	"github.com/lindb/linsight/alerting/model"
)

type Notifier interface {
	Notify(ctx context.Context, alerts []*model.Alert) error
}
