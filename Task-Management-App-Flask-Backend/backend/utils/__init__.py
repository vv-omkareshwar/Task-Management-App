"""
Utility package for the Task Management App.

This package contains various utility functions and helpers used across the application.
"""

from typing import Callable
from .helpers import require_auth

# Importing additional utility functions (assuming they exist)
from .validators import validate_email, validate_password
from .formatters import format_date, format_currency

# Package-level constants
DEFAULT_PAGINATION_LIMIT = 20
MAX_TASK_TITLE_LENGTH = 100

# Type alias for clarity
AuthDecorator = Callable[..., Callable]

# Exporting the main utilities
__all__ = [
    'require_auth',
    'validate_email',
    'validate_password',
    'format_date',
    'format_currency',
    'DEFAULT_PAGINATION_LIMIT',
    'MAX_TASK_TITLE_LENGTH',
]

# If any package initialization is needed, we could add it here
def initialize_utils():
    """Initialize the utils package if needed."""
    # For example, setting up logging
    import logging
    logging.basicConfig(level=logging.INFO)

# Call the initialization function
initialize_utils()