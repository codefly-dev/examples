from pydantic import BaseModel
from typing import List
from datetime import datetime


class CreateVisitResponse(BaseModel):
    visit_number: int


class DailyVisitStatistics(BaseModel):
    date: datetime
    visits: int


class GetVisitStatisticsRequest(BaseModel):
    pass


class GetVisitStatisticsResponse(BaseModel):
    total_visits: int
    visits: List[DailyVisitStatistics]
