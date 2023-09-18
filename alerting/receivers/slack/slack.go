package slack

import (
	"context"
	"fmt"

	"github.com/slack-go/slack"

	"github.com/lindb/linsight/alerting/model"
	"github.com/lindb/linsight/alerting/receivers"
)

type notifer struct {
}

func New() receivers.Notifier {
	return &notifer{}
}

func (n *notifer) Notify(ctx context.Context, alerts []*model.Alert) error {
	token := "token"
	api := slack.New(token)
	message := "Hello, lin!"
	channelID := "#channel"
	s1, s2, err := api.PostMessage(
		channelID,
		slack.MsgOptionText(message, false),
	)
	fmt.Println(s1)
	fmt.Println(s2)
	fmt.Println(err)
	if err != nil {
		return err
	}
	return nil
}
