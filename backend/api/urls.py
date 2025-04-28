from django.urls import path
from . import views

urlpatterns = [
    path("favorites/", views.FavoriteListCreate.as_view(), name="favorite-list"),
    path("favorite/delete/<int:pk>/", views.FavoritesDelete.as_view(), name="delete-favorites"),
    path('mealplans/', views.MealPlanListCreate.as_view(), name='mealplan-list-create'),
    path('mealplans/<int:user_id>/<int:pk>/', views.MealPlanDelete.as_view(), name='mealplan-delete'),
  
]
