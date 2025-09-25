from django.apps import AppConfig


class TasksConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tasks'
    verbose_name = 'Tasks & Projects'

    def ready(self):
        # Import signals
        from . import signals  # noqa: F401
