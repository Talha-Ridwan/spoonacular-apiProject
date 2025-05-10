from django.db import models
from django.contrib.auth.models import User

class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.pk is None:  # Only for new instances
            user_activity_count = UserActivity.objects.filter(user=self.user).count()
            max_records = 100
            if user_activity_count + 1 > max_records:
                excess_count = (user_activity_count + 1) - max_records
                old_activities = UserActivity.objects.filter(user=self.user).order_by('timestamp')[:excess_count]
                old_activities.delete()
        super().save(*args, **kwargs)