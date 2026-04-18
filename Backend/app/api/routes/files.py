from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.permissions import require_permission
from app.models.user import User

router = APIRouter()

# Allowed file extensions to prevent path tricks
_ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}


@router.get("/labs/{patient_id}/{filename}", response_class=FileResponse)
async def download_lab_file(
    patient_id: str,
    filename: str,
    _: User = Depends(require_permission("canViewLabs")),
):
    """Serve an uploaded lab file. Requires canViewLabs permission."""
    # Reject path traversal attempts and disallowed extensions
    if ".." in patient_id or ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid path")

    ext = Path(filename).suffix.lower()
    if ext not in _ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type")

    # Priority 1: Check Supabase if configured
    from app.services.file_service import _supabase
    if _supabase:
        try:
            # Generate a signed URL for secure, temporary access
            res = _supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).create_signed_url(
                path=f"labs/{patient_id}/{filename}",
                expires_in=60
            )
            if res and "signedURL" in res:
                from fastapi.responses import RedirectResponse
                return RedirectResponse(url=res["signedURL"])
        except Exception:
            pass  # Fallback to local filesystem if Supabase is unavailable

    # Priority 2: Local Filesystem
    file_path = Path(settings.UPLOAD_DIR) / "labs" / patient_id / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found")

    return FileResponse(path=str(file_path))

