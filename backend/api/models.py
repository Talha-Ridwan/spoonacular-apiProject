from django.db import models

# Create your models here.
from django.contrib.auth.models  import User

class Favorites(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")

    def __str__(self):
        return self.title
    
class MealPlan(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="MealPlans")
    mealData = models.JSONField()
