from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, FavoritesSerializer, MealPlanSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Favorites, MealPlan
from rest_framework.response import Response
from rest_framework.views import APIView
# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class FavoriteListCreate(generics.ListCreateAPIView):
    serializer_class = FavoritesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Favorites.objects.filter(owner=user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class FavoritesDelete(generics.DestroyAPIView):
    serializer_class = FavoritesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Favorites.objects.filter(owner=user)


class SaveMealPlanView(APIView):


    def post(self, request):
        meal_plan_data = request.data
        MealPlan.objects.update_or_create(
            user=request.user,
            defaults={'plan_data': meal_plan_data}
        )
        return Response({"message": "Meal plan saved"})

class GetMealPlanView(APIView):


    def get(self, request):
        try:
            meal_plan = MealPlan.objects.get(user=request.user)
            return Response(meal_plan.plan_data)
        except MealPlan.DoesNotExist:
            return Response({"message": "No meal plan found"}, status=404)