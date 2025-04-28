# history/urls.py
from django.urls import path
from history.views import UserActivityView

urlpatterns = [
    path("", UserActivityView.as_view(), name="history"),  # This matches /api/history/
]
