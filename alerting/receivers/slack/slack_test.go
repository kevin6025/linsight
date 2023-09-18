package slack

import (
	"context"
	"testing"
)

func TestNotify(t *testing.T) {
	n := New()
	n.Notify(context.TODO(), nil)
}
