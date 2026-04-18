import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db
from app.core.permissions import require_permission
from app.core.rate_limit import SUMMARY_GENERATE_LIMIT, rate_limit_dependency
from app.crud import crud_summary, crud_chart, crud_patient
from app.models.user import User
from app.schemas.summary import SummaryResponse
from app.schemas.common import ok
from app.services import summary_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("", status_code=status.HTTP_200_OK)
async def get_summary(
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canViewCharting")),
):
    try:
        patient = await crud_patient.get_patient(db, patient_id)
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")

        summary = await crud_summary.get_summary(db, patient_id)
        if not summary:
            raise HTTPException(status_code=404, detail="No summary available yet")

        return ok(SummaryResponse.model_validate(summary).model_dump(mode="json", by_alias=True))
    except HTTPException:
        raise
    except Exception:
        logger.exception("Summary retrieval failed for patient %s", patient_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal retrieval error",
        )


@router.post(
    "/generate",
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(rate_limit_dependency(SUMMARY_GENERATE_LIMIT))],
)
async def generate_summary(
    request: Request,
    patient_id: str,
    db: AsyncSession = Depends(get_db),
    _: User = Depends(require_permission("canEditCharting")),
):
    patient = await crud_patient.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    entries = await crud_chart.list_chart_entries(db, patient_id)
    generated = await summary_service.generate_patient_summary(list(entries))

    summary = await crud_summary.upsert_summary(
        db,
        patient_id=patient_id,
        chief_complaint=generated["chief_complaint"],
        past_medical_history=generated["past_medical_history"],
        recent_developments=generated["recent_developments"],
        current_assessment=generated["current_assessment"],
    )
    request.state.audit_details = "Regenerated summary"
    request.state.audit_resource_id = patient_id
    return ok(SummaryResponse.model_validate(summary).model_dump(mode="json", by_alias=True))
