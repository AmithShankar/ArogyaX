"""baseline

Revision ID: b7c902a64410
Revises: 0584a0e35252
Create Date: 2026-03-05 13:35:05.901111

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7c902a64410'
down_revision: Union[str, Sequence[str], None] = '0584a0e35252'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
