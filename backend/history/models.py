from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class UserActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

    def save(self,*args, **kwargs):
        self.clean_up_old_entries()
        super().save(*args, **kwargs)
    
    def clean_up_old_entries(self):
        user_activity_count = UserActivity.objects.filter(user=self.user).count()
        max_records = 100
    
        if user_activity_count > max_records:

            excess_count = user_activity_count - max_records
          
            old_activities = UserActivity.objects.filter(user=self.user).order_by('timestamp')[:excess_count]
            old_activities.delete()
