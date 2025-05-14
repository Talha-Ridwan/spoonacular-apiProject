from django.db import models

# Create your models here.
from django.contrib.auth.models  import User

class Favorites(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    food_id = models.CharField(max_length=100)
    def __str__(self):
        return self.title
    
class MealPlan(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    plan_data = models.JSONField()
