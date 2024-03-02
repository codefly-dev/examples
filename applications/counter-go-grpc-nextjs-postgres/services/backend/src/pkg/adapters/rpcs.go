package adapters

import (
	"backend/pkg/gen"
	"context"
	"google.golang.org/protobuf/types/known/timestamppb"
	"math/rand"
	"time"
)

func (s *GrpcServer) CreateVisit(ctx context.Context, request *gen.CreateVisitRequest) (*gen.CreateVisitResponse, error) {
	return &gen.CreateVisitResponse{
		VisitNumber: 10,
	}, nil
}

func roundTimeAndConvertToProto(t time.Time) *timestamppb.Timestamp {
	roundedTime := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, t.Location())
	return timestamppb.New(roundedTime)
}

func randomVisits() int64 {
	// random between 0 and 100
	return int64(rand.Intn(11))
}

func generateFakeData() []*gen.DailyVisitStatistics {
	// generate for the last 30 days
	var data []*gen.DailyVisitStatistics
	t := time.Now()
	for i := 0; i < 30; i++ {
		t = t.Add(-24 * time.Hour)
		data = append(data, &gen.DailyVisitStatistics{
			Date:   roundTimeAndConvertToProto(t),
			Visits: randomVisits(),
		})

	}
	return data
}

func (s *GrpcServer) GetVisitStatistics(ctx context.Context, request *gen.GetVisitStatisticsRequest) (*gen.GetVisitStatisticsResponse, error) {
	return &gen.GetVisitStatisticsResponse{
		Visits:      generateFakeData(),
		TotalVisits: 1000,
	}, nil
}
