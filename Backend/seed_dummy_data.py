import os
import random
import string
import uuid
from datetime import date, datetime, timedelta
from decimal import Decimal

import psycopg2
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection details from .env
DB_URL = os.getenv("DATABASE_URL")
if not DB_URL:
    print("DATABASE_URL not found in .env")
    exit(1)

# Strip the SQLAlchemy prefix if present
if DB_URL.startswith("postgresql+psycopg2://"):
    DB_URL = DB_URL.replace("postgresql+psycopg2://", "postgres://")
elif DB_URL.startswith("postgresql+asyncpg://"):
    DB_URL = DB_URL.replace("postgresql+asyncpg://", "postgres://")
elif DB_URL.startswith("postgresql://"):
    DB_URL = DB_URL.replace("postgresql://", "postgres://")
# Psycopg2 works best with postgres:// or a connection string DSN


def generate_patient_readable_id():
    prefix = f"AX{datetime.now().strftime('%y%m')}"
    chars = string.ascii_uppercase + string.digits
    safe_chars = "".join([c for c in chars if c not in "0O1IL"])
    suffix = "".join(random.choices(safe_chars, k=6))
    return f"{prefix}-{suffix}"


def seed_data():
    try:
        conn = psycopg2.connect(DB_URL)
        cur = conn.cursor()

        print("--- Fetching staff IDs (Phones 1-7) ---")
        cur.execute(
            "SELECT id, role, phone FROM users WHERE phone IN ('1', '2', '3', '4', '5', '6', '7')"
        )
        staff_rows = cur.fetchall()

        staff_map = {row[2]: row[0] for row in staff_rows}
        role_map = {row[1]: row[0] for row in staff_rows}  # Role to ID fallback

        if not staff_rows:
            print("No staff users (1-7) found. Please run seed_extra_users.py first.")
            return

        # Specific IDs for specific tasks
        doctor_id = staff_map.get("1") or role_map.get("doctor")
        nurse_id = staff_map.get("2") or role_map.get("nurse")
        admin_id = staff_map.get("7") or staff_map.get("6") or role_map.get("owner")

        print(f"Using Lead Doctor: {doctor_id}")
        print(f"Using Admin/Owner: {admin_id}")

        # Data Lists
        first_names = [
            "Arjun",
            "Deepika",
            "Rohan",
            "Sanya",
            "Vikram",
            "Anjali",
            "Kabir",
            "Meera",
            "Aditya",
            "Ishani",
            "Siddharth",
            "Pooja",
            "Aravind",
            "Neha",
            "Rahul",
            "Priya",
            "Karthik",
            "Sneha",
            "Amit",
            "Riya",
        ]
        last_names = [
            "Sharma",
            "Verma",
            "Gupta",
            "Malhotra",
            "Kapoor",
            "Singhania",
            "Joshi",
            "Iyer",
            "Nair",
            "Reddy",
            "Patel",
            "Chopra",
            "Desai",
            "Bose",
            "Mehta",
            "Venkatesh",
            "Choudhury",
            "Das",
            "Menon",
            "Kaur",
        ]
        medications = [
            ("Amoxicillin", "500mg", "TID", "7 days"),
            ("Metformin", "850mg", "BID", "30 days"),
            ("Amlodipine", "5mg", "OD", "90 days"),
            ("Atorvastatin", "20mg", "HS", "90 days"),
            ("Pantoprazole", "40mg", "OD (Empty Stomach)", "14 days"),
            ("Paracetamol", "650mg", "SOS", "5 days"),
            ("Levothyroxine", "75mcg", "OD", "180 days"),
            ("Vildagliptin", "50mg", "BID", "30 days"),
            ("Losartan", "50mg", "OD", "90 days"),
            ("Azithromycin", "500mg", "OD", "3 days"),
        ]

        referrers = [
            "Dr. K. S. Murthy",
            "Wellness Clinic",
            "Self-Referral",
            "City Hospital",
            "Walk-in",
            "Dr. Shalini Rai",
            "Insurance Portal",
        ]
        genders = ["male", "female", "other"]
        invoice_titles = [
            "Consultation Fee",
            "Follow-up Visit",
            "Annual Lab Package",
            "Vaccination",
            "Emergency Care",
            "Specialist Referral",
            "Minor Procedure",
        ]
        invoice_statuses = ["paid", "pending", "overdue", "cancelled"]
        chart_types = ["visit", "vitals", "lab", "note"]

        print("--- Seeding Patients ---")
        patient_ids = []
        for i in range(20):
            p_uuid = str(uuid.uuid4())
            readable_id = generate_patient_readable_id()
            name = f"{random.choice(first_names)} {random.choice(last_names)}"
            phone = f"{random.randint(6000000000, 9999999999)}"
            address = f"{random.randint(1, 400)}, {random.choice(['Park Lane', 'MG Road', 'Indiranagar', 'Banjara Hills', 'Powai', 'Salt Lake'])}, {random.choice(['Bangalore', 'Mumbai', 'Hyderabad', 'Delhi', 'Chennai', 'Kolkata'])}"
            dob = date(
                random.randint(1960, 2018), random.randint(1, 12), random.randint(1, 28)
            )
            gender = random.choice(genders)
            referred = random.choice(referrers)

            cur.execute(
                "INSERT INTO patients (id, patient_id, name, phone, address, date_of_birth, gender, referred_by) VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING",
                (p_uuid, readable_id, name, phone, address, dob, gender, referred),
            )
            patient_ids.append(p_uuid)

        print(f"Seeded {len(patient_ids)} patients.")

        print("--- Seeding Prescriptions ---")
        for _ in range(50):
            p_id = random.choice(patient_ids)
            med, dose, freq, dur = random.choice(medications)
            pres_uuid = str(uuid.uuid4())
            status = random.choice(["active", "completed", "discontinued"])

            # Random date within last 6 months
            created_dt = date.today() - timedelta(days=random.randint(0, 180))

            cur.execute(
                "INSERT INTO prescriptions (id, patient_id, prescribed_by_id, medication, dosage, frequency, duration, status, created_dt) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (pres_uuid, p_id, doctor_id, med, dose, freq, dur, status, created_dt),
            )

        print("--- Seeding Invoices ---")
        for _ in range(30):
            p_id = random.choice(patient_ids)
            title = random.choice(invoice_titles)
            amount = Decimal(random.randint(500, 15000))
            inv_uuid = str(uuid.uuid4())
            status = random.choice(invoice_statuses)
            inv_date = date.today() - timedelta(days=random.randint(0, 90))

            cur.execute(
                "INSERT INTO invoices (id, patient_id, name, amount, status, date) VALUES (%s, %s, %s, %s, %s, %s)",
                (inv_uuid, p_id, title, amount, status, inv_date),
            )

        print("--- Seeding Chart Entries ---")
        vitals_templates = [
            "BP: 120/80 mmHg, SpO2: 98%, HR: 72 bpm, Temp: 98.4 F",
            "BP: 135/90 mmHg, HR: 88 bpm. Patient reporting mild headache.",
            "Weight: 72kg, Height: 175cm. BMI: 23.5. Healthy range.",
            "BP: 110/70 mmHg, SpO2: 99%, HR: 64 bpm.",
            "Temperature: 101.2 F. Patient exhibiting fever symptoms.",
        ]
        note_templates = [
            "Follow-up scheduled in 2 weeks. Patient progressing well.",
            "Discussed lifestyle changes and dietary modifications.",
            "Reported mild allergic reaction to previous supplement. Changed brands.",
            "Initial assessment for routine health checkup.",
            "Patient advised to increase fluid intake and rest.",
        ]

        all_staff_ids = list(staff_map.values())
        for _ in range(80):
            p_id = random.choice(patient_ids)
            ctype = random.choice(chart_types)
            chart_uuid = str(uuid.uuid4())
            random_staff_id = random.choice(all_staff_ids)

            # Assign specific roles to specific chart types for realism
            if ctype == "vitals":
                comment = random.choice(vitals_templates)
                creator_id = nurse_id  # Use our Head Nurse for vitals
            elif ctype == "note":
                comment = random.choice(note_templates)
                creator_id = random_staff_id
            elif ctype == "visit":
                comment = f"Consultation session regarding {random.choice(['chronic pain', 'digestive issues', 'annual physical', 'seasonal flu', 'skin irritation'])}."
                creator_id = doctor_id  # Doctor for consultation
            else:
                comment = f"Lab results uploaded for {random.choice(['Complete Blood Count', 'Thyroid Profile', 'Lipid Panel', 'Vitamin D Test'])}."
                creator_id = random_staff_id

            created_dt = datetime.now() - timedelta(
                days=random.randint(0, 180), hours=random.randint(0, 24)
            )

            cur.execute(
                "INSERT INTO chart_entries (id, patient_id, user_id, type, comments, created_dt) VALUES (%s, %s, %s, %s, %s, %s)",
                (chart_uuid, p_id, creator_id, ctype, comment, created_dt),
            )

        conn.commit()
        print("--- SUCCESS: All dummy data seeded successfully! ---")
        cur.close()
        conn.close()

    except Exception as e:
        print(f"--- ERROR: {e} ---")


if __name__ == "__main__":
    seed_data()
