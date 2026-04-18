"""add all tables

Revision ID: 0001_add_all_tables
Revises: 0584a0e35252
Create Date: 2026-03-18

"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "0001_add_all_tables"
down_revision: Union[str, Sequence[str], None] = "b7c902a64410"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ── gender_type enum ──────────────────────────────────────────────────────
    gender_type = postgresql.ENUM(
        "male", "female", "other", "prefer_not_to_say", name="gender_type", create_type=False
    )
    gender_type.create(op.get_bind(), checkfirst=True)

    # ── chart_type enum ───────────────────────────────────────────────────────
    chart_type = postgresql.ENUM(
        "visit", "vitals", "lab", "note", name="chart_type", create_type=False
    )
    chart_type.create(op.get_bind(), checkfirst=True)

    # ── patients ──────────────────────────────────────────────────────────────
    op.create_table(
        "patients",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("phone", sa.String(20), nullable=False),
        sa.Column("address", sa.Text, nullable=True),
        sa.Column("date_of_birth", sa.Date, nullable=False),
        sa.Column(
            "gender",
            postgresql.ENUM(
                "male", "female", "other", "prefer_not_to_say",
                name="gender_type", create_type=False
            ),
            nullable=False,
        ),
        sa.Column(
            "created_timestamp",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("referred_by", sa.String(100), nullable=True),
    )

    # ── chart_entries ─────────────────────────────────────────────────────────
    op.create_table(
        "chart_entries",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column(
            "patient_id",
            sa.String(50),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("user_id", sa.String(50), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("comments", sa.Text, nullable=True),
        sa.Column(
            "type",
            postgresql.ENUM(
                "visit", "vitals", "lab", "note", name="chart_type", create_type=False
            ),
            nullable=False,
        ),
        sa.Column("upload_url", sa.Text, nullable=True),
        sa.Column(
            "created_dt",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    # ── prescriptions ─────────────────────────────────────────────────────────
    op.create_table(
        "prescriptions",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column(
            "patient_id",
            sa.String(50),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "prescribed_by_id",
            sa.String(50),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column("medication", sa.String(150), nullable=False),
        sa.Column("dosage", sa.String(50), nullable=False),
        sa.Column("frequency", sa.String(50), nullable=False),
        sa.Column("duration", sa.String(50), nullable=False),
        sa.Column("status", sa.String(50), server_default="active"),
        sa.Column("created_dt", sa.Date, server_default=sa.text("CURRENT_DATE")),
    )

    # ── invoices ──────────────────────────────────────────────────────────────
    op.create_table(
        "invoices",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column(
            "patient_id",
            sa.String(50),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("amount", sa.Numeric(10, 2), nullable=False),
        sa.Column("comments", sa.Text, nullable=True),
        sa.Column("date", sa.Date, server_default=sa.text("CURRENT_DATE")),
    )

    # ── patient_summaries ─────────────────────────────────────────────────────
    op.create_table(
        "patient_summaries",
        sa.Column(
            "patient_id",
            sa.String(50),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column("chief_complaint", sa.Text, nullable=True),
        sa.Column("past_medical_history", sa.Text, nullable=True),
        sa.Column("recent_developments", sa.Text, nullable=True),
        sa.Column("current_assessment", sa.Text, nullable=True),
        sa.Column(
            "last_updated",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    # ── audit_logs ────────────────────────────────────────────────────────────
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(50), primary_key=True),
        sa.Column("user_id", sa.String(50), sa.ForeignKey("users.id"), nullable=True),
        sa.Column("action", sa.String(50), nullable=False),
        sa.Column("resource", sa.String(50), nullable=False),
        sa.Column("resource_id", sa.String(50), nullable=True),
        sa.Column("details", sa.Text, nullable=True),
        sa.Column(
            "timestamp",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("patient_summaries")
    op.drop_table("invoices")
    op.drop_table("prescriptions")
    op.drop_table("chart_entries")
    op.drop_table("patients")

    op.execute("DROP TYPE IF EXISTS chart_type")
    op.execute("DROP TYPE IF EXISTS gender_type")
