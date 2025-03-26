from flask import current_app
from flask_jwt_extended import create_access_token, decode_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import timedelta

def generate_token(user_id: str) -> str:
    """
    Generate a JWT token for the given user ID.
    
    Args:
        user_id (str): The ID of the user.
    
    Returns:
        str: The generated JWT token.
    """
    expires = timedelta(days=30)
    return create_access_token(identity=user_id, expires_delta=expires)

def verify_token(token: str) -> dict:
    """
    Verify and decode the given JWT token.
    
    Args:
        token (str): The JWT token to verify.
    
    Returns:
        dict: The decoded token payload.
    
    Raises:
        jwt.ExpiredSignatureError: If the token has expired.
        jwt.InvalidTokenError: If the token is invalid.
    """
    try:
        return decode_token(token)
    except Exception as e:
        current_app.logger.error(f"Token verification failed: {str(e)}")
        raise

def hash_password(password: str) -> str:
    """
    Hash the given password.
    
    Args:
        password (str): The password to hash.
    
    Returns:
        str: The hashed password.
    """
    return generate_password_hash(password)

def check_password(hashed_password: str, password: str) -> bool:
    """
    Check if the given password matches the hashed password.
    
    Args:
        hashed_password (str): The hashed password to compare against.
        password (str): The password to check.
    
    Returns:
        bool: True if the password matches, False otherwise.
    """
    return check_password_hash(hashed_password, password)