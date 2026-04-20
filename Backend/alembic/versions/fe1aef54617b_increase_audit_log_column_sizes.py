"""Increase audit_log column sizes

Revision ID: fe1aef54617b
Revises: b4807e1e6946
Create Date: 2026-04-20 18:56:10.936047

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fe1aef54617b'
down_revision: Union[str, Sequence[str], None] = 'b4807e1e6946'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema: Increase column sizes for audit_logs table."""
    op.alter_column('audit_logs', 'action', type_=sa.String(length=255), existing_type=sa.String(length=50), existing_nullable=False)
    op.alter_column('audit_logs', 'resource', type_=sa.String(length=512), existing_type=sa.String(length=50), existing_nullable=False)
    op.alter_column('audit_logs', 'resource_id', type_=sa.String(length=255), existing_type=sa.String(length=50), existing_nullable=True)


def downgrade() -> None:
    """Downgrade schema: Revert column sizes for audit_logs table."""
    op.alter_column('audit_logs', 'action', type_=sa.String(length=50), existing_type=sa.String(length=255), existing_nullable=False)
    op.alter_column('audit_logs', 'resource', type_=sa.String(length=50), existing_type=sa.String(length=512), existing_nullable=False)
    op.alter_column('audit_logs', 'resource_id', type_=sa.String(length=50), existing_type=sa.String(length=255), existing_nullable=True)
