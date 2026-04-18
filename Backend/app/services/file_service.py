import os
import uuid
from pathlib import Path
from typing import Any, Optional

import aiofiles
from fastapi import HTTPException, UploadFile, status

try:
    from supabase import create_client, Client
    _HAS_SUPABASE = True
except ImportError:
    Client = Any
    _HAS_SUPABASE = False

from app.core.config import settings

ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/png", "image/jpg"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# Initialize Supabase client if library is installed and keys are present
_supabase: Optional[Any] = None
if _HAS_SUPABASE and settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
    try:
        _supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
    except Exception:
        _supabase = None



async def save_lab_file(patient_id: str, file: UploadFile) -> str:
    """Save an uploaded lab file and return the access URL."""
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type '{file.content_type}' not allowed. Use PDF, JPG, or PNG.",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File exceeds 10 MB limit.",
        )

    ext = Path(file.filename).suffix.lower() if file.filename else ".bin"
    filename = f"{uuid.uuid4()}{ext}"
    storage_path = f"labs/{patient_id}/{filename}"

    # Priority 1: Supabase Storage
    if _supabase:
        try:
            # Note: storage().upload is synchronous in this library version
            _supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).upload(
                path=storage_path,
                file=contents,
                file_options={"content-type": file.content_type}
            )
            # Return the public URL or a consistent internal path that our /files redirector handles
            return f"/files/labs/{patient_id}/{filename}"
        except Exception as e:
            # Fallback to local if Supabase fails (optional, or just raise error)
            if settings.IS_PRODUCTION:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Cloud storage upload failed: {str(e)}"
                )

    # Priority 2: Local Filesystem (Dev/Fallback)
    upload_dir = Path(settings.UPLOAD_DIR) / "labs" / patient_id
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / filename
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(contents)

    return f"/files/labs/{patient_id}/{filename}"


def delete_lab_file(url: str) -> None:
    """Delete a previously saved file from whichever provider it resides in."""
    # URL format: /files/labs/{patient_id}/{filename}
    prefix = "/files/"
    if not url.startswith(prefix):
        return
    
    relative_path = url[len(prefix):]
    if ".." in relative_path:
        return

    # Delete from Supabase if configured
    if _supabase:
        try:
            _supabase.storage.from_(settings.SUPABASE_STORAGE_BUCKET).remove([relative_path])
        except Exception:
            pass

    # Delete from local disk
    full_path = Path(settings.UPLOAD_DIR) / relative_path
    if full_path.exists() and full_path.is_file():
        os.remove(full_path)

