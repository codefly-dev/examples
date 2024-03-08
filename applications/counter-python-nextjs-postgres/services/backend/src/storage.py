import datetime
import psycopg2
from typing import Optional

from visit import *


class Storage:
    def __init__(self, connection: str) -> None:
        self.conn = psycopg2.connect(connection)

    def get_cursor(self):
        return self.conn.cursor()

    def create_visit(self) -> Optional[CreateVisitResponse]:
        try:
            with self.get_cursor() as cursor:
                today = datetime.today().date()
                cursor.execute("""
                    INSERT INTO store (date, visits)
                    VALUES (%s, 1)
                    ON CONFLICT (date) DO NOTHING
                """, (today,))
                cursor.execute("""
                    UPDATE store
                    SET visits = visits + 1
                    WHERE date = %s
                    RETURNING visits
                """, (today,))
                result = cursor.fetchone()
                self.conn.commit()
                return CreateVisitResponse(visit_number=result[0]) if result else None
        except Exception as e:
            print(f"An error occurred: {e}")

    def get_visit_statistics(self) -> Optional[GetVisitStatisticsResponse]:
        with self.get_cursor() as cursor:
            cursor.execute("""
                SELECT date, visits
                FROM store
            """)
            rows = cursor.fetchall()
            visits = [DailyVisitStatistics(date=row[0], visits=row[1]) for row in rows]
            total_visits = sum([visit.visits for visit in visits])
            return GetVisitStatisticsResponse(total_visits=total_visits, visits=visits)
