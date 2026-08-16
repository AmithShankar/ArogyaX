import re
from typing import Any, Union, Dict, List

from app.core.permissions import ROLE_PERMISSIONS
from app.models.user import User, UserRole

# Fields redacted for each censor category
_PATIENT_REDACT_FIELDS: dict[str, Any] = {
    "medication": "[REDACTED]",
    "dosage": "[REDACTED]",
    "frequency": "[REDACTED]",
    "duration": "[REDACTED]",
    "upload": None,
    "upload_url": None,
}

_CLINICAL_REDACT_FIELDS: dict[str, Any] = {
    "comments": "[CLINICAL DATA REDACTED]",
    "notes": "[CLINICAL DATA REDACTED]",
    "medication": "[REDACTED]",
    "dosage": "[REDACTED]",
    "frequency": "[REDACTED]",
    "duration": "[REDACTED]",
    "upload": None,
    "upload_url": None,
}

_BILLING_REDACT_FIELDS: dict[str, Any] = {
    "comments": "[FINANCIAL DATA REDACTED]",
    "patient_name": "[CENSORED]",
    "patient_phone": "[CENSORED]",
    "patientName": "[CENSORED]",
    "patientPhone": "[CENSORED]",
}


def _can_view_sensitive(user: User) -> bool:
    """Returns True only for roles with canViewSensitiveData (hospital_admin, owner)."""
    return ROLE_PERMISSIONS.get(user.role, {}).get("canViewSensitiveData", False)


def _is_auditor(user: User) -> bool:
    return user.role == UserRole.auditor


def _can_view_patient_pii(user: User) -> bool:
    """Patient PII (name, phone, address, DOB) is accessible to all roles except auditors.
    Auditors review processes and compliance workflows — not individual patient identity.
    """
    return not _is_auditor(user)


def _can_view_clinical(user: User) -> bool:
    """Clinical data (chart notes, medications) is accessible to roles with canViewCharting."""
    return ROLE_PERMISSIONS.get(user.role, {}).get("canViewCharting", False)


def _apply_redactions(item: Dict[str, Any], redact_map: dict[str, Any]) -> Dict[str, Any]:
    censored = item.copy()
    for field, replacement in redact_map.items():
        if field in censored:
            censored[field] = replacement
    return censored


def censor_patient_data(
    user: User,
    data: Union[Dict[str, Any], List[Dict[str, Any]]],
) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
    """Redact PII fields for auditors.
    All clinical and administrative roles can see full patient PII.
    Auditors review compliance workflows, not individual patient identity.
    """
    if _can_view_patient_pii(user):
        return data
    if isinstance(data, list):
        return [_censor_single_patient(item) for item in data]
    return _censor_single_patient(data)


def censor_clinical_data(
    user: User,
    data: Union[Dict[str, Any], List[Dict[str, Any]]],
) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
    """Redact clinical notes and medication fields for roles without canViewCharting.
    Roles with canViewCharting (doctor, nurse, lab_tech, hospital_admin, owner, auditor)
    can see full clinical data.
    """
    if _can_view_clinical(user):
        return data
    if isinstance(data, list):
        return [_apply_redactions(item, _CLINICAL_REDACT_FIELDS) for item in data]
    return _apply_redactions(data, _CLINICAL_REDACT_FIELDS)


def censor_billing_data(
    user: User,
    data: Union[Dict[str, Any], List[Dict[str, Any]]],
) -> Union[Dict[str, Any], List[Dict[str, Any]]]:
    """Redact financial amounts and comments for roles without canViewSensitiveData."""
    if _can_view_sensitive(user):
        return data
    if isinstance(data, list):
        return [_apply_redactions(item, _BILLING_REDACT_FIELDS) for item in data]
    return _apply_redactions(data, _BILLING_REDACT_FIELDS)


def _censor_single_patient(patient: Dict[str, Any]) -> Dict[str, Any]:
    censored = _apply_redactions(patient, _PATIENT_REDACT_FIELDS)

    # Handle both snake_case and camelCase aliases
    phone_keys = ["phone", "patientPhone"]
    address_keys = ["address", "patientAddress"]
    name_keys = ["name", "patientName"]
    dob_keys = ["date_of_birth", "dateOfBirth"]
    email_keys = ["email", "patientEmail"]

    for k in phone_keys:
        if k in censored and censored[k]:
            censored[k] = "[CENSORED]"
    
    for k in address_keys:
        if k in censored and censored[k]:
            censored[k] = "[CENSORED]"
            
    for k in name_keys:
        if k in censored and censored[k]:
            censored[k] = "[CENSORED NAME]"
            
    for k in dob_keys:
        if k in censored and censored[k]:
            censored[k] = "01-01-1900" # Dummy date

    for k in email_keys:
        if k in censored and censored[k]:
            censored[k] = "[CENSORED]"

    return censored


def _mask_string(s: str) -> str:
    if len(s) <= 4:
        return "****"
    return "*" * (len(s) - 4) + s[-4:]


def _mask_email(email: str) -> str:
    try:
        name, domain = email.split("@", 1)
        return f"{name[0]}{'*' * (len(name) - 1)}@{domain}"
    except (AttributeError, ValueError):
        return "****"


_AUDIT_REDACT_PATTERNS = [
    r"BP \d{2,3}/\d{2,3}",
    r"Temp \d{2,3}(\.\d)?",
    r"Spo2 \d{2,3}%",
    r"Pulse \d{2,3}",
    r"Weight \d{2,3}(\.\d)?",
    r"Medication: [^,]+",
    r"Dosage: [^,]+",
]


def censor_audit_log(
    user: User,
    data: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """Redact embedded clinical values from audit log details for non-sensitive roles."""
    if _can_view_sensitive(user):
        return data

    censored_list = []
    for log in data:
        c = log.copy()
        if "details" in c and c["details"]:
            details = c["details"]
            for pattern in _AUDIT_REDACT_PATTERNS:
                details = re.sub(pattern, "[REDACTED]", details, flags=re.IGNORECASE)
            c["details"] = details
        censored_list.append(c)
    return censored_list
