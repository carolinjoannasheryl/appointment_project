from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from appointment_service import AppointmentService

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = AppointmentService()

@app.get("/appointments")
def get_appointments(date: Optional[str] = None, status: Optional[str] = None):
    filters = {}
    if date:
        filters["date"] = date
    if status:
        filters["status"] = status
    return service.get_appointments(filters)

@app.patch("/appointments/{id}/status")
def update_status(id: str, status: str = Body(..., embed=True)): # Expects JSON body { "status": "NewStatus" }
    updated_apt = service.update_appointment_status(id, status)
    if not updated_apt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated_apt

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
