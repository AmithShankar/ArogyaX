# Import all models so alembic can detect them
from app.models.summary import PatientSummary as PatientSummary
from app.models.audit_log import AuditLog as AuditLog
from app.models.chart_entry import ChartEntry as ChartEntry
from app.models.invoice import Invoice as Invoice
from app.models.patient import Patient as Patient
from app.models.prescription import Prescription as Prescription
from app.models.user import User as User
