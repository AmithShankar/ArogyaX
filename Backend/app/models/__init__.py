# Import all models so alembic can detect them
from app.models.summary import PatientSummary
from app.models.audit_log import AuditLog
from app.models.chart_entry import ChartEntry
from app.models.invoice import Invoice
from app.models.patient import Patient
from app.models.prescription import Prescription
from app.models.user import User
