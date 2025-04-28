from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Favorites, MealPlan
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username", "password"]
        extra_kwargs = {"password":{"write_only":True}}

    def create(self, validated_data):  #once seralizer validates data, it is passed here
        user = User.objects.create_user(**validated_data)
        return user

class FavoritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorites
        fields = ["id", "title", "created_at", "owner"]
        extra_kwargs = {"owner":{"read_only":True}}

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = ['id', 'owner', 'mealData']
        read_only_fields = ["id", 'owner']