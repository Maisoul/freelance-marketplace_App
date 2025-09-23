import os
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile
from django.conf import settings

def validate_task_file(file: UploadedFile):
    """
    Validates uploaded task files for:
    - File size (max 10MB)
    - Allowed extensions
    - Basic file signature check
    """
    # Check file size (10MB limit)
    max_size = 10 * 1024 * 1024  # 10MB in bytes
    if file.size > max_size:
        raise ValidationError(f'File size must not exceed {max_size/(1024*1024)}MB')
    
    # Check file extension
    allowed_extensions = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.zip']
    ext = os.path.splitext(file.name)[1].lower()
    if ext not in allowed_extensions:
        raise ValidationError(f'File type not allowed. Allowed types: {", ".join(allowed_extensions)}')
    
    # Basic file signature check for common file types
    signatures = {
        'pdf': b'%PDF',
        'png': b'\x89PNG\r\n\x1a\n',
        'jpg': b'\xff\xd8\xff',
        'docx': b'PK\x03\x04',
        'zip': b'PK\x03\x04'
    }
    
    # Read first few bytes for signature check
    file.seek(0)
    content = file.read(8)
    file.seek(0)
    
    # Get expected signature based on extension
    ext_no_dot = ext[1:] if ext.startswith('.') else ext
    if ext_no_dot in signatures:
        signature = signatures[ext_no_dot]
        if not content.startswith(signature):
            raise ValidationError('File content does not match its extension')