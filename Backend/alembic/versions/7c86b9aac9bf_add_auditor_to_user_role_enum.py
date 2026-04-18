"""add auditor to user_role enum

Revision ID: 7c86b9aac9bf
Revises: 00fc217c99a1
Create Date: 2026-04-14 18:32:18.047289

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7c86b9aac9bf'
down_revision: Union[str, Sequence[str], None] = '00fc217c99a1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("COMMIT")
    op.execute("ALTER TYPE user_role ADD VALUE 'auditor'")


def downgrade() -> None:
    """Downgrade schema."""
    # Postgres doesn't easily support removing enum values
    pass
