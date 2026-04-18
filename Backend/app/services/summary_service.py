from typing import Optional

from app.models.chart_entry import ChartEntry


async def generate_patient_summary(
    chart_entries: list[ChartEntry],
) -> dict[str, Optional[str]]:
    """
    Generate a summary from a patient's chart history.
    """
    if not chart_entries:
        return {
            "chief_complaint": None,
            "past_medical_history": None,
            "recent_developments": None,
            "current_assessment": "No chart entries available to generate summary.",
        }

    by_type: dict[str, int] = {}
    for entry in chart_entries:
        by_type[entry.type.value] = by_type.get(entry.type.value, 0) + 1

    summary_lines = [f"- {count} {etype} record(s)" for etype, count in by_type.items()]

    return {
        "chief_complaint": "Auto-generated summary",
        "past_medical_history": "Review chart entries for full history.",
        "recent_developments": "\n".join(summary_lines),
        "current_assessment": "Based on available chart entries.",
    }
