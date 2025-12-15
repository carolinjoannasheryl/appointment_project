from datetime import date, datetime, timedelta
from typing import List, Optional, Dict

class AppointmentService:
    def __init__(self):
        # 1. Data Mocking: Hardcoded list simulating Aurora fetch
        # Fields: name, date, time, duration, doctorName, status, mode
        self.appointments = [
            {
                "id": "1",
                "name": "Sarah Johnson",
                "date": str(date.today()),
                "time": "09:00 AM",
                "duration": "30 min",
                "doctorName": "Dr. Rajesh Kumar",
                "status": "Confirmed",
                "mode": "In-Person",
                "reason": "Diabetes Management Review",
                "note": "Patient needs prescription refill",
                "phone": "+91 98765 43210",
                "email": "sarah.j@email.com"
            },
            {
                "id": "2",
                "name": "Michael Chen",
                "date": str(date.today()),
                "time": "10:00 AM",
                "duration": "45 min",
                "doctorName": "Dr. Priya Sharma",
                "status": "Scheduled",
                "mode": "In-Person",
                "reason": "Annual Physical Examination",
                "note": "Routine checkup",
                "phone": "+91 98765 43211",
                "email": "m.chen@email.com"
            },
            {
                "id": "3",
                "name": "Emily Rodriguez",
                "date": str(date.today()),
                "time": "11:30 AM",
                "duration": "30 min",
                "doctorName": "Dr. Rajesh Kumar",
                "status": "Confirmed",
                "mode": "Video Call",
                "reason": "Cold and Flu Symptoms",
                "note": "Video consultation requested",
                "phone": "+91 98765 43212",
                "email": "emily.r@email.com"
            },
            {
                "id": "4",
                "name": "David Kim",
                "date": str(date.today() + timedelta(days=1)),
                "time": "09:30 AM",
                "duration": "30 min",
                "doctorName": "Dr. Priya Sharma",
                "status": "Scheduled",
                "mode": "Video",
                "reason": "Follow-up Consultation",
                "note": "Review blood test results",
                "phone": "+91 98765 43213",
                "email": "david.k@email.com"
            },
            {
                "id": "5",
                "name": "Aretha Franklin",
                "date": str(date.today() + timedelta(days=1)),
                "time": "02:00 PM",
                "duration": "60 min",
                "doctorName": "Dr. Jones",
                "status": "Scheduled",
                "mode": "In-Person",
                "reason": "Vocal Cord Assessment",
                "note": "Prepare for tour",
                "phone": "+91 98765 43214",
                "email": "aretha.f@email.com"
            },
            {
                "id": "6",
                "name": "Elvis Presley",
                "date": str(date.today() - timedelta(days=1)),
                "time": "10:00 AM",
                "duration": "30 min",
                "doctorName": "Dr. Smith",
                "status": "Cancelled",
                "mode": "In-Person",
                "reason": "Routine Checkup",
                "note": "Patient cancelled",
                "phone": "+91 98765 43215",
                "email": "elvis@email.com"
            },
            {
                "id": "7",
                "name": "Freddie Mercury",
                "date": str(date.today() - timedelta(days=1)),
                "time": "11:00 AM",
                "duration": "30 min",
                "doctorName": "Dr. Brown",
                "status": "Completed",
                "mode": "Video",
                "reason": "Vocal Strain",
                "note": "Complete voice rest recommended",
                "phone": "+91 98765 43216",
                "email": "freddie@email.com"
            },
            {
                "id": "8",
                "name": "David Bowie",
                "date": str(date.today()),
                "time": "04:00 PM",
                "duration": "30 min",
                "doctorName": "Dr. Smith",
                "status": "Scheduled",
                "mode": "In-Person",
                "reason": "General checkup",
                "note": "Follow up on previous visit",
                "phone": "+91 98765 43217",
                "email": "starman@email.com"
            },
            {
                "id": "9",
                "name": "Elton John",
                "date": str(date.today() + timedelta(days=2)),
                "time": "09:00 AM",
                "duration": "45 min",
                "doctorName": "Dr. Jones",
                "status": "Confirmed",
                "mode": "Video",
                "reason": "Glasses Prescription",
                "note": "Vision check",
                "phone": "+91 98765 43218",
                "email": "rocketman@email.com"
            },
            {
                "id": "10",
                "name": "Stevie Wonder",
                "date": str(date.today()),
                "time": "01:00 PM",
                "duration": "30 min",
                "doctorName": "Dr. Brown",
                "status": "Scheduled",
                "mode": "In-Person",
                "reason": "Eye Exam",
                "note": "Regular checkup",
                "phone": "+91 98765 43219",
                "email": "stevie@email.com"
            },
            
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
        
        if "start_date" in filters and filters["start_date"]:
            filtered_list = [apt for apt in filtered_list if apt["date"] >= filters["start_date"]]
            
        if "end_date" in filters and filters["end_date"]:
            filtered_list = [apt for apt in filtered_list if apt["date"] <= filters["end_date"]]
        
        if "status" in filters and filters["status"]:
            # Case-insensitive status match could be added, but keeping it simple
            if filters["status"] != "All Status":
                filtered_list = [apt for apt in filtered_list if apt["status"] == filters["status"]]
            
        if "doctor_name" in filters and filters["doctor_name"]:
             if filters["doctor_name"] != "All Doctors":
                filtered_list = [apt for apt in filtered_list if apt["doctorName"] == filters["doctor_name"]]

        if "search_query" in filters and filters["search_query"]:
            query = filters["search_query"].lower()
            filtered_list = [apt for apt in filtered_list if query in apt["name"].lower() or query in apt["doctorName"].lower()]
            
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
