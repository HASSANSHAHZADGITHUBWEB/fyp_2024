from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status,generics
from django.http import Http404

from ...models import User, Subscriber, UserMessage
from .seralizeradmin import UserMessageSerializer,UserSerializer,SubscriberSerializer
from .seralizeradmin import ChangePasswordSerializer,UserProfileUpdateSerializer

class EmployeeToSubscriberMessageAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        sender = request.user  # JWT User
        receiver_id = request.data.get('subscriber_id')
        message_text = request.data.get('message')

        if not receiver_id or not message_text:
            return Response(
                {"error": "subscriber_id and message are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            subscriber = Subscriber.objects.get(id=receiver_id)
        except Subscriber.DoesNotExist:
            return Response(
                {"error": "Subscriber not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        msg = UserMessage.objects.create(
            sender=sender,
            receiver=subscriber,
            message=message_text
        )

        serializer = UserMessageSerializer(msg)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SubscriberMessageHistoryAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request, subscriber_id):
        messages = UserMessage.objects.filter(
            receiver_id=subscriber_id
        ).order_by('-sent_at')

        serializer = UserMessageSerializer(messages, many=True)
        return Response(serializer.data)

class MarkMessageReadAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def post(self, request, message_id):
        try:
            message = UserMessage.objects.get(id=message_id)
            message.read = True
            message.save()
            return Response({"message": "Message marked as read"})
        except UserMessage.DoesNotExist:
            return Response({"error": "Message not found"}, status=404)

class EmployeeListAPIView(APIView):
    # use for get and post user data
    # permission_classes = [IsAuthenticated] 

    def get(self, request):
        # ✅ FAST: Fetches User AND Designation in 1 database query
        users = User.objects.select_related('designation').all()
        
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Create a new Employee"""
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SubscriberListAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        """List all Subscribers"""
        subscribers = Subscriber.objects.all()
        serializer = SubscriberSerializer(subscribers, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Create a new Subscriber"""
        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            # The model's save() method will handle hashing and trial logic
            serializer.save() 
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# ## new addition for it ####
#  use for updateand delete user
class EmployeeDetailAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get_object(self, id):
        try:
            return User.objects.get(id=id)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, id):
        """Get single employee details"""
        user = self.get_object(id)
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, id):
        """Update Employee (Edit)"""
        user = self.get_object(id)
        # partial=True allows updating just one field (e.g., just name) without sending everything
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save() # Your User model's save() method will automatically hash the password if changed
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        """Delete Employee"""
        user = self.get_object(id)
        user.delete()
        return Response({"message": "Employee deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

#  detail update and delete view
class SubscriberDetailAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get_object(self, id):
        """Helper method to get object or raise 404"""
        try:
            return Subscriber.objects.get(id=id)
        except Subscriber.DoesNotExist:
            raise Http404

    def get(self, request, id):
        """Get single Subscriber details"""
        subscriber = self.get_object(id)
        serializer = SubscriberSerializer(subscriber)
        return Response(serializer.data)

    def put(self, request, id):
        """Update Subscriber (Edit)"""
        subscriber = self.get_object(id)
        
        # partial=True allows updating just one field (e.g., just phone number)
        serializer = SubscriberSerializer(subscriber, data=request.data, partial=True)
        
        if serializer.is_valid():
            # Your Subscriber model's save() will handle password re-hashing if it was changed
            serializer.save() 
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        """Delete Subscriber"""
        subscriber = self.get_object(id)
        subscriber.delete()
        return Response({"message": "Subscriber deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
# setting page seralizers for update profile and password in setting page 
# --- 1. Profile Update View ---
class UserProfileUpdateAPIView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileUpdateSerializer

    def get_object(self):
        # Returns the current logged-in user instance from YOUR model
        return self.request.user

    def update(self, request, *args, **kwargs):
        # Allow partial updates (e.g., just updating phone number)
        kwargs['partial'] = True 
        return super().update(request, *args, **kwargs)

# --- 2. Change Password View ---
class ChangePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = request.user
            # Matches React 'newPassword' field
            user.set_password(serializer.validated_data['newPassword']) 
            user.save()
            return Response(
                {"success": True, "msg": "Password updated successfully"}, 
                status=status.HTTP_200_OK
            )

        # If validation fails (e.g. wrong current password), return the error
        return Response({"msg": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)