from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Session, create_engine, select
from sqlalchemy import func
from typing import List
from backend.models import MaintenanceRequest, User, Apartment, Message, Lease


from backend.ai_engine import analyze_maintenance_request, ask_gemini_fast

# --- DB SETUP ---
sqlite_file_name = "balima.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

def create_db_and_seed():
    SQLModel.metadata.create_all(engine)

app = FastAPI(title="Balima SmartRent Ecosystem")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_seed()

# --- AUTH ---
@app.post("/api/login")
def login(data: dict = Body(...)):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data['email'])).first()
        if not user or user.password != data['password']:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return {"id": user.id, "name": user.name, "role": user.role}

# --- PUBLIC LISTINGS ---
@app.get("/api/apartments")
def get_apartments():
    with Session(engine) as session:
        return session.exec(select(Apartment)).all()

# --- CHAT ---
@app.get("/api/messages")
def get_messages():
    with Session(engine) as session:
        return session.exec(select(Message).order_by(Message.id)).all()

@app.post("/api/messages")
def send_message(msg: dict):
    with Session(engine) as session:
        new_msg = Message(sender_role=msg['role'], sender_name=msg['name'], content=msg['content'])
        session.add(new_msg)
        session.commit()
        return new_msg

@app.delete("/api/messages")
def clear_chat(role: str = Body(embed=True)):
    """
    Allow Manager to clear the channel.
    """
    if role != "manager":
        raise HTTPException(status_code=403, detail="Only Managers can clear the chat.")

    with Session(engine) as session:
        session.exec(text("DELETE FROM message"))
        session.commit()
    return {"status": "cleared"}

# --- DASHBOARD STATS ---
@app.get("/api/dashboard-stats")
def get_stats():
    with Session(engine) as session:
        pending_requests = session.exec(select(func.count(MaintenanceRequest.id)).where(MaintenanceRequest.status == "To Do")).first() or 0
        revenue = session.exec(select(func.sum(Apartment.price)).where(Apartment.status == "Occupied")).first() or 0

        # Fallback for Demo
        if revenue == 0:
            return {
                "occupancy_rate": 88, "monthly_revenue": 115000, "active_leases": 42,
                "pending_requests": pending_requests, "ai_insights": []
            }

        total_units = session.exec(select(func.count(Apartment.id))).first() or 1
        occupied_units = session.exec(select(func.count(Apartment.id)).where(Apartment.status == "Occupied")).first() or 0
        occupancy_rate = int((occupied_units / total_units) * 100)

        return {
            "occupancy_rate": occupancy_rate, "monthly_revenue": revenue,
            "active_leases": occupied_units, "pending_requests": pending_requests, "ai_insights": []
        }

# --- NOTIFICATIONS ---
@app.get("/api/notifications/{role}")
def get_notifications(role: str):
    with Session(engine) as session:
        notifs = []
        # Messages
        recent_msgs = session.exec(select(Message).order_by(Message.id.desc()).limit(3)).all()
        for msg in recent_msgs:
            if msg.sender_role != role:
                notifs.append({
                    "id": f"msg-{msg.id}", "title": f"Message from {msg.sender_name}",
                    "desc": msg.content[:40] + "...", "time": msg.timestamp
                })
        # Requests
        if role == "manager" or role == "technician":
            requests = session.exec(select(MaintenanceRequest).where(MaintenanceRequest.status == "To Do").limit(5)).all()
            for r in requests:
                notifs.append({
                    "id": f"req-{r.id}", "title": f"New Request: {r.category}",
                    "desc": f"{r.unit_number} - {r.priority}", "time": "Active Now"
                })
        elif role == "tenant":
            requests = session.exec(select(MaintenanceRequest).where(MaintenanceRequest.status != "To Do").limit(5)).all()
            for r in requests:
                notifs.append({
                    "id": f"upd-{r.id}", "title": "Status Update",
                    "desc": f"Your {r.category} request is {r.status}", "time": "Recently"
                })
        return {"count": len(notifs), "items": notifs}



@app.post("/api/ai/ask")
async def ask_ai(data: dict):
    from backend.ai_engine import ask_gemini_fast

    with Session(engine) as session:
        # 1. DB Context
        rev = session.exec(select(func.sum(Apartment.price)).where(Apartment.status == "Occupied")).first() or 0
        pending = session.exec(select(func.count(MaintenanceRequest.id)).where(MaintenanceRequest.status == "To Do")).first() or 0

        # 2. Chat History Context (Prevent "What is that?" errors)
        prev_answer = data.get('previous_answer', 'None')

        # 3. Construct Context String
        full_context = f"""
        - Monthly Revenue: {rev} MAD
        - Pending Requests: {pending}
        - Recent Conversation Topic: "{prev_answer}"
        """

    # 4. Call AI
    answer = await ask_gemini_fast(data['question'], full_context)

    return {"answer": answer}

# --- TENANT/TECH OPS ---
@app.post("/api/submit-request")
async def submit_request(request: dict):
    ai_result = await analyze_maintenance_request(request['description'])
    new_ticket = MaintenanceRequest(
        tenant_name="Sarah Connor", unit_number="4B", description=request['description'],
        category=ai_result['category'], priority=ai_result['priority'],
        ai_analysis=f"{ai_result['summary']} (Est: {ai_result['estimated_cost']})"
    )
    with Session(engine) as session:
        session.add(new_ticket)
        session.commit()
    return new_ticket

@app.get("/api/technician/jobs")
def get_jobs():
    with Session(engine) as session:
        return session.exec(select(MaintenanceRequest)).all()

@app.post("/api/technician/update-status")
def update_status(data: dict = Body(...)):
    with Session(engine) as session:
        job = session.get(MaintenanceRequest, data['id'])
        if job:
            job.status = data['status']
            session.add(job)
            session.commit()
    return {"ok": True}

@app.get("/api/tenant/requests")
def get_tenant_requests():
    with Session(engine) as session:
        return session.exec(select(MaintenanceRequest).order_by(MaintenanceRequest.id.desc())).all()

# ... existing imports
from sqlalchemy import text



@app.delete("/api/maintenance/all")
def delete_all_requests(data: dict = Body(...)):
    if data['role'] != 'manager':
        raise HTTPException(status_code=403, detail="Only Managers can perform this action.")

    with Session(engine) as session:
        session.exec(text("DELETE FROM maintenancerequest"))
        session.commit()

    return {"status": "All work orders deleted"}

@app.delete("/api/maintenance/all")
def delete_all_requests(data: dict = Body(...)):
    """
    DANGER: Deletes ALL maintenance requests. Manager Only.
    """
    if data['role'] != 'manager':
        raise HTTPException(status_code=403, detail="Only Managers can perform this action.")

    with Session(engine) as session:
        session.exec(text("DELETE FROM maintenancerequest"))
        session.commit()

    return {"status": "All work orders deleted"}