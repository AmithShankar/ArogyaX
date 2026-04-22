from fastapi import APIRouter, Depends, status
from sqlalchemy import extract, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db
from app.core.permissions import require_permission
from app.models.chart_entry import ChartEntry, ChartType
from app.models.invoice import Invoice
from app.models.patient import Patient
from app.models.prescription import Prescription
from app.models.user import User
from app.schemas.common import ok

router = APIRouter()


@router.get("/stats", status_code=status.HTTP_200_OK)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewAdminDashboard")),
):
    total_patients = (await db.execute(select(func.count(Patient.id)))).scalar_one()
    total_users = (await db.execute(select(func.count(User.id)))).scalar_one()
    total_visits = (
        await db.execute(
            select(func.count(ChartEntry.id)).where(ChartEntry.type == ChartType.visit)
        )
    ).scalar_one()
    total_revenue = (
        await db.execute(select(func.coalesce(func.sum(Invoice.amount), 0)))
    ).scalar_one()
    active_prescriptions = (
        await db.execute(
            select(func.count(Prescription.id)).where(Prescription.status == "active")
        )
    ).scalar_one()

    return ok(
        {
            "totalPatients": total_patients,
            "totalUsers": total_users,
            "totalVisits": total_visits,
            "totalRevenue": float(total_revenue),
            "activePrescriptions": active_prescriptions,
        }
    )


@router.get("/monthly-visits", status_code=status.HTTP_200_OK)
async def get_monthly_visits(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewAdminDashboard")),
):
    result = await db.execute(
        select(
            extract("year", ChartEntry.created_dt).label("year"),
            extract("month", ChartEntry.created_dt).label("month"),
            func.count(ChartEntry.id).label("count"),
        )
        .where(ChartEntry.type == ChartType.visit)
        .group_by("year", "month")
        .order_by("year", "month")
    )
    rows = result.all()
    return ok(
        [{"year": int(r.year), "month": int(r.month), "count": r.count} for r in rows]
    )


@router.get("/revenue", status_code=status.HTTP_200_OK)
async def get_monthly_revenue(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewAdminDashboard")),
):
    result = await db.execute(
        select(
            extract("year", Invoice.date).label("year"),
            extract("month", Invoice.date).label("month"),
            func.coalesce(func.sum(Invoice.amount), 0).label("total"),
        )
        .group_by("year", "month")
        .order_by("year", "month")
    )
    rows = result.all()
    return ok(
        [{"year": int(r.year), "month": int(r.month), "total": float(r.total)} for r in rows]
    )


@router.get("/diagnosis-distribution", status_code=status.HTTP_200_OK)
async def get_diagnosis_distribution(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewAdminDashboard")),
):
    """Returns count of chart entries grouped by type as a proxy for diagnosis distribution."""
    result = await db.execute(
        select(
            ChartEntry.type.label("type"),
            func.count(ChartEntry.id).label("count"),
        ).group_by(ChartEntry.type)
    )
    rows = result.all()
    return ok([{"type": r.type.value, "count": r.count} for r in rows])


@router.get("/patient-frequency", status_code=status.HTTP_200_OK)
async def get_patient_frequency(
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewAdminDashboard")),
):
    """
    Returns visit frequency distribution (how many patients have 1 visit, 2 visits, etc.)
    Performed via nested aggregation for maximum performance.
    """
    # Subquery: Count visits per patient
    subquery = (
        select(
            ChartEntry.patient_id,
            func.count(ChartEntry.id).label("visit_count")
        )
        .where(ChartEntry.type == ChartType.visit)
        .group_by(ChartEntry.patient_id)
        .subquery()
    )

    # Main query: Group by visit_count and count occurrences
    result = await db.execute(
        select(
            subquery.c.visit_count,
            func.count().label("patient_count")
        )
        .group_by(subquery.c.visit_count)
        .order_by(subquery.c.visit_count)
    )
    
    rows = result.all()
    return ok([
        {"visits": str(r.visit_count), "count": r.patient_count} 
        for r in rows
    ])
