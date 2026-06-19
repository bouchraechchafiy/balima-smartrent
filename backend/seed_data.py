from sqlmodel import Session, SQLModel, create_engine, select, text
from backend.models import User, Apartment, MaintenanceRequest, Lease

sqlite_file_name = "balima.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"
engine = create_engine(sqlite_url)

def seed_db():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # 1. RESET DATA (Clean Slate)
        session.exec(text("DELETE FROM apartment"))
        session.exec(text("DELETE FROM maintenancerequest"))
        session.exec(text("DELETE FROM lease"))
        session.exec(text("DELETE FROM user"))
        session.exec(text("DELETE FROM message"))
        session.commit()

        print("--- SEEDING OFFICIAL BALIMA INVENTORY ---")

        # 2.  (Based on Official Website Listings)
        apts = [
            # --- HARCOURT WING (Family & Deluxe) ---
            Apartment(
                code="HARCOURT 33",
                type="Suite BALIMA Harcourt (2 Beds)",
                size=110.0, price=12000, status="Occupied", vacancy_risk=5, ai_suggested_price=12500,
                address="Harcourt Wing, 3rd Floor",
                image_url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800" # Modern Family Living
            ),
            Apartment(
                code="HARCOURT 32",
                type="Deluxe 2-Bedroom",
                size=115.0, price=12500, status="Vacant", vacancy_risk=25, ai_suggested_price=12500,
                address="Harcourt Wing, Balcony View",
                image_url="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800"
            ),
            Apartment(
                code="HARCOURT 11",
                type="Suite Urbaine",
                size=85.0, price=9500, status="Vacant", vacancy_risk=10, ai_suggested_price=9800,
                address="Harcourt Wing, 1st Floor",
                image_url="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800"
            ),

            # --- MINARET WING (Views & Penthouses) ---
            Apartment(
                code="MINARET 61",
                type="Senior Suite Penthouse",
                size=160.0, price=22000, status="Occupied", vacancy_risk=15, ai_suggested_price=23000,
                address="Top Floor, Panoramic Terrace",
                image_url="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800" # Luxury Penthouse vibe
            ),
            Apartment(
                code="MINARET 42",
                type="Superior Suite",
                size=95.0, price=11000, status="Vacant", vacancy_risk=20, ai_suggested_price=11000,
                address="Minaret Wing, City View",
                image_url="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800"
            ),

            # --- BALIMA XI (Executive Studios) ---
            Apartment(
                code="BALIMA XI 24",
                type="Executive Studio",
                size=55.0, price=6500, status="Vacant", vacancy_risk=5, ai_suggested_price=6700,
                address="Ave Mohammed V, 2nd Floor",
                image_url="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800"
            ),
            Apartment(
                code="BALIMA XI 44",
                type="Corner Suite (Fireplace)",
                size=70.0, price=7800, status="Occupied", vacancy_risk=40, ai_suggested_price=8000,
                address="Ave Mohammed V, 4th Floor",
                image_url="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800"
            ),

            # --- BALIMA III (Parliament View) ---
            Apartment(
                code="BALIMA III A32",
                type="Junior Suite Parliament",
                size=75.0, price=8500, status="Occupied", vacancy_risk=85, ai_suggested_price=8800,
                address="Direct Parliament View",
                image_url="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800"
            ),
            Apartment(
                code="BALIMA III B21",
                type="Lalla de Moulati Suite",
                size=80.0, price=9000, status="Vacant", vacancy_risk=10, ai_suggested_price=9500,
                address="Historic Wing, Art Deco Style",
                image_url="https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800"
            ),
        ]

        for apt in apts:
            session.add(apt)

        # 3. USERS (Moroccan Names)
        session.add(User(email="admin@balima.com", password="123", name="Hassan El Mansouri", role="manager"))
        session.add(User(email="Samir@balima.com", password="123", name="Samir Amrani", role="tenant"))
        session.add(User(email="youssef@balima.com", password="123", name="Youssef Benali", role="technician"))

        # 4. MAINTENANCE (Linked to Real Units)
        session.add(MaintenanceRequest(tenant_name="Laila Amrani", unit_number="BALIMA III A32", description="Water pressure is low in the shower", category="Plumbing", priority="Medium", ai_analysis="Check pressure valve", status="To Do"))
        session.add(MaintenanceRequest(tenant_name="Hassan (Admin)", unit_number="MINARET 61", description="Terrace door lock jammed", category="General", priority="High", ai_analysis="Security risk", status="In Progress"))

        session.commit()
        print("--- SEEDING COMPLETE: 9 OFFICIAL UNITS ---")

if __name__ == "__main__":
    seed_db()