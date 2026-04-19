from fastapi import APIRouter

from app.api.routes import (
    admin,
    audit_log,
    auth,
    charts,
    files,
    invoices,
    patients,
    prescriptions,
    summary,
    users,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(files.router, prefix="/files", tags=["Files"])
api_router.include_router(
    charts.router,
    prefix="/patients/{patient_id}/charts",
    tags=["Charts"],
)
api_router.include_router(
    prescriptions.router,
    prefix="/patients/{patient_id}/prescriptions",
    tags=["Prescriptions"],
)
api_router.include_router(
    invoices.router,
    prefix="/patients/{patient_id}/invoices",
    tags=["Invoices"],
)
api_router.include_router(
    invoices.global_router,
    prefix="/billing",
    tags=["Billing Dashboard"],
)
api_router.include_router(
    charts.global_router,
    prefix="/charts",
    tags=["Charts Dashboard"],
)
api_router.include_router(
    prescriptions.global_router,
    prefix="/prescriptions",
    tags=["Prescriptions Dashboard"],
)
api_router.include_router(
    summary.router,
    prefix="/patients/{patient_id}/summary",
    tags=["Summary"],
)
api_router.include_router(audit_log.router, prefix="/audit-log", tags=["Audit Log"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Dashboard"])
