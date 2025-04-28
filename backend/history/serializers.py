from .models import UserActivity
from rest_framework import serializers

class UserActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivity
        fields = ["id", "user", "activity", "timestamp"]
