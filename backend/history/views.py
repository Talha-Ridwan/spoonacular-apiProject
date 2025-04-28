from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import UserActivitySerializer
from .models import UserActivity

class UserActivityView(generics.ListCreateAPIView):
    serializer_class = UserActivitySerializer
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_queryset(self):
        return UserActivity.objects.filter(user=self.request.user)  # Fetch only the activities of the logged-in user
