from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import User,Designation,UserHistory
from .serializers import UserRegisterSerializer, LoginSerializer,DesignationSerializer


class DesignationListAPIView(APIView):
    def get(self, request):
        designations = Designation.objects.all()
        serializer = DesignationSerializer(designations, many=True)
        return Response(serializer.data)

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_device_info(request):
    return request.META.get('HTTP_USER_AGENT', 'Unknown Device')

class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email'].lower()  # ✅ Normalize email
        password = serializer.validated_data['password']

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid Email"}, status=400)

        if not user.check_password(password):
            return Response({"error": "Invalid Password"}, status=400)

        # 🔐 JWT Tokens
        refresh = RefreshToken.for_user(user)

        # 🧾 Save login history
        UserHistory.objects.create(
            user=user,
            ip_address=get_client_ip(request),
            device_info=get_device_info(request)
        )

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "designation": user.designation.name if user.designation else None
            }
        }, status=status.HTTP_200_OK)

    


class RegisterAPIView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully"}, status=201)

        return Response(serializer.errors, status=400)
    
class LogoutAPIView(APIView):
    # Disable auth to manually handle token
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        try:
            # --- STEP 1: Find User via Access Token ---
            auth_header = request.headers.get('Authorization')
            if not auth_header or 'Bearer' not in auth_header:
                return Response({"error": "Access Token missing in Header"}, status=400)
            
            token_str = auth_header.split(' ')[1]
            try:
                access_token = AccessToken(token_str)
                user_id = access_token['user_id']  # Get user ID from payload
            except Exception:
                return Response({"error": "Invalid or Expired Access Token"}, status=401)
            
            # --- STEP 2: Get User from custom table ---
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "User not found"}, status=404)

            # --- STEP 3: Calculate Session Time ---
            last_history = UserHistory.objects.filter(user=user).last()
            if last_history and last_history.total_time is None:
                login_datetime = datetime.combine(last_history.login_date, last_history.login_time)
                if timezone.is_naive(login_datetime):
                    login_datetime = timezone.make_aware(login_datetime)
                
                duration = timezone.now() - login_datetime
                last_history.total_time = duration
                last_history.save()

            # ✅ STEP 4: Return Success (No Blacklist)
            return Response({
                "message": "Logout successful",
                "session_time": str(last_history.total_time if last_history else "0")
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)
