from django.urls import path
from . import views

urlpatterns = [
    path("favorites/", views.FavoriteListCreate.as_view(), name="favorite-list"),
    path("favorite/delete/<int:pk>/", views.FavoritesDelete.as_view(), name="delete-favorites"),
    path("mealplanner/get", views.GetMealPlanView.as_view(), name="get-meal-plan"),
    path("mealplanner/save", views.SaveMealPlanView.as_view(), name="save-meal-plan")
]
