from datetime import date, datetime, timedelta
from typing import List, Optional, Dict

class AppointmentService:
    def __init__(self):
        # 1. Data Mocking: Hardcoded list simulating Aurora fetch
        # Fields: name, date, time, duration, doctorName, status, mode
        self.appointments = [
            {
                "id": "1",
                "name": "John Doe",
                "date": str(date.today()),
                "time": "09:00 AM",
                "duration": "30 min",
                "doctorName": "Dr. Smith",
                "status": "Upcoming",
                "mode": "In-Person"
            },
            {
                "id": "2",
                "name": "Jane Roe",
                "date": str(date.today()),
                "time": "10:00 AM",
                "duration": "45 min",
                "doctorName": "Dr. Jones",
                "status": "Confirmed",
                "mode": "Video"
            },
            {
                "id": "3",
                "name": "Alice Bob",
                "date": str(date.today()),
                "time": "11:00 AM",
                "duration": "15 min",
                "doctorName": "Dr. Smith",
                "status": "Completed",
                "mode": "In-Person"
            },
            {
                "id": "4",
                "name": "Charlie Day",
                "date": str(date.today() + timedelta(days=1)),
                "time": "09:30 AM",
                "duration": "30 min",
                "doctorName": "Dr. Brown",
                "status": "Scheduled",
                "mode": "Video"
            },
            {
                "id": "5",
                "name": "Aretha Franklin",
                "date": str(date.today() + timedelta(days=1)),
                "time": "02:00 PM",
                "duration": "60 min",
                "doctorName": "Dr. Jones",
                "status": "Upcoming",
                "mode": "In-Person"
            },
            {
                "id": "6",
                "name": "Elvis Presley",
                "date": str(date.today() - timedelta(days=1)),
                "time": "10:00 AM",
                "duration": "30 min",
                "doctorName": "Dr. Smith",
                "status": "Cancelled",
                "mode": "In-Person"
            },
            {
                "id": "7",
                "name": "Freddie Mercury",
                "date": str(date.today() - timedelta(days=1)),
                "time": "11:00 AM",
                "duration": "30 min",
                "doctorName": "Dr. Brown",
                "status": "Completed",
                "mode": "Video"
            },
            {
                "id": "8",
                "name": "David Bowie",
                "date": str(date.today()),
                "time": "04:00 PM",
                "duration": "30 min",
                "doctorName": "Dr. Smith",
                "status": "Upcoming",
                "mode": "In-Person"
            },
            {
                "id": "9",
                "name": "Elton John",
                "date": str(date.today() + timedelta(days=2)),
                "time": "09:00 AM",
                "duration": "45 min",
                "doctorName": "Dr. Jones",
                "status": "Confirmed",
                "mode": "Video"
            },
            {
                "id": "10",
                "name": "Stevie Wonder",
                "date": str(date.today()),
                "time": "01:00 PM",
                "duration": "30 min",
                "doctorName": "Dr. Brown",
                "status": "Scheduled",
                "mode": "In-Person"
            }
        ]

    # 2. Query Function
    def get_appointments(self, filters: Optional[Dict] = None) -> List[Dict]:
        """
        Accepts optional arguments (date: String, status: String) and filters the mock list.
        """
        if not filters:
            return self.appointments

        filtered_list = self.appointments

        if "date" in filters and filters["date"]:
            # Simple string match for date
            filtered_list = [apt for apt in filtered_list if apt["date"] == filters["date"]]
        
        if "status" in filters and filters["status"]:
            # Case-insensitive status match could be added, but keeping it simple
            filtered_list = [apt for apt in filtered_list if apt["status"] == filters["status"]]
            
        return filtered_list

    # 3. Mutation Function
    def update_appointment_status(self, id: str, new_status: str) -> Optional[Dict]:
        """
        Updates the status of an appointment in the mock data.
        
        In a real scenario:
        - This would trigger an AppSync Subscription to notify connected clients of the change.
        - This would perform an Aurora transactional write (UPDATE appointments SET status = :new_status WHERE id = :id).
        """
        for apt in self.appointments:
            if apt["id"] == id:
                apt["status"] = new_status
                return apt
        return None
