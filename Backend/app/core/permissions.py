from fastapi import Depends, HTTPException, status

from app.api.dependencies import get_current_user
from app.models.user import User, UserRole

ROLE_PERMISSIONS: dict[UserRole, dict[str, bool]] = {
    UserRole.doctor: {
        "canViewPatients": True,
        "canEditPatients": True,
        "canViewCharting": True,
        "canEditCharting": True,
        "canViewPrescriptions": True,
        "canEditPrescriptions": True,
        "canViewLabs": True,
        "canUploadLabs": False,
        "canViewBilling": True,
        "canViewAdminDashboard": False,
        "canManageUsers": False,
        "canViewAuditLog": False,
    },
    UserRole.nurse: {
        "canViewPatients": True,
        "canEditPatients": True,
        "canViewCharting": True,
        "canEditCharting": True,
        "canViewPrescriptions": True,
        "canEditPrescriptions": True,
        "canViewLabs": True,
        "canUploadLabs": False,
        "canViewBilling": True,
        "canEditBilling": True,
        "canViewAdminDashboard": False,
        "canManageUsers": False,
        "canViewAuditLog": False,
    },
    UserRole.reception: {
        "canViewPatients": True,
        "canEditPatients": True,
        "canViewCharting": False,
        "canEditCharting": False,
        "canViewPrescriptions": False,
        "canEditPrescriptions": False,
        "canViewLabs": False,
        "canUploadLabs": False,
        "canViewBilling": True,
        "canViewAdminDashboard": False,
        "canManageUsers": False,
        "canViewAuditLog": False,
    },
    UserRole.pharmacy: {
        "canViewPatients": True,
        "canEditPatients": False,
        "canViewCharting": False,
        "canEditCharting": False,
        "canViewPrescriptions": True,
        "canEditPrescriptions": True,
        "canViewLabs": False,
        "canUploadLabs": False,
        "canViewBilling": True,
        "canEditBilling": True,
        "canViewAdminDashboard": False,
        "canManageUsers": False,
        "canViewAuditLog": False,
    },
    UserRole.lab_tech: {
        "canViewPatients": True,
        "canEditPatients": False,
        "canViewCharting": True,
        "canEditCharting": False,
        "canViewPrescriptions": False,
        "canEditPrescriptions": False,
        "canViewLabs": True,
        "canUploadLabs": True,
        "canViewBilling": False,
        "canViewAdminDashboard": False,
        "canManageUsers": False,
        "canViewAuditLog": False,
    },
    UserRole.hospital_admin: {
        "canViewPatients": True,
        "canEditPatients": True,
        "canViewCharting": True,
        "canEditCharting": False,
        "canViewPrescriptions": True,
        "canEditPrescriptions": False,
        "canViewLabs": True,
        "canUploadLabs": False,
        "canViewBilling": True,
        "canEditBilling": True,
        "canViewAdminDashboard": True,
        "canManageUsers": True,
        "canViewAuditLog": True,
        "canViewSensitiveData": True,
        "canDeleteData": True,
    },
    UserRole.owner: {
        "canViewPatients": True,
        "canEditPatients": True,
        "canViewCharting": True,
        "canEditCharting": True,
        "canViewPrescriptions": True,
        "canEditPrescriptions": True,
        "canViewLabs": True,
        "canUploadLabs": True,
        "canViewBilling": True,
        "canEditBilling": True,
        "canViewAdminDashboard": True,
        "canManageUsers": True,
        "canViewAuditLog": True,
        "canViewSensitiveData": True,
        "canDeleteData": True,
    },
    UserRole.auditor: {
        "canViewPatients": True,
        "canEditPatients": False,
        "canViewCharting": True,
        "canEditCharting": False,
        "canViewPrescriptions": True,
        "canEditPrescriptions": False,
        "canViewLabs": True,
        "canUploadLabs": False,
        "canViewBilling": True,
        "canEditBilling": False,
        "canViewAdminDashboard": True,
        "canManageUsers": False,
        "canViewAuditLog": True,
        "canViewSensitiveData": False,
        "canDeleteData": False,
    },
}


def require_permission(permission: str):
    """FastAPI dependency factory - gates a route behind a specific RBAC permission."""

    async def _check(current_user=Depends(get_current_user)):
        perms = ROLE_PERMISSIONS.get(current_user.role, {})
        allowed = perms.get(permission, False)

        if not allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action.",
            )
        return current_user

    return _check


def get_permissions(user: User) -> dict[str, bool]:
    """Retrieves the full permission set for a specific user based on their role."""
    return ROLE_PERMISSIONS.get(user.role, {})
