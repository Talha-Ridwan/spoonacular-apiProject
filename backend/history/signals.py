from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .models import UserActivity
from django.utils.timezone import now

@receiver(user_logged_in)
def create_user_activity_on_login(sender, request, user, **kwargs):
    print("User logged in:", user)  # Debug print
    UserActivity.objects.create(
        user=user,
        action="logged in",
        timestamp=now()
    )

@receiver(user_logged_out)
def create_user_activity_on_logout(sender, request, user, **kwargs):
    print("User logged out:", user)  # Debug print
    UserActivity.objects.create(
        user=user,
        action="logged out",
        timestamp=now()
    )
