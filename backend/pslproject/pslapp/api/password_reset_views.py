from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from pslapp.models import User, PasswordResetToken
from pslapp.api.serializers import (
    ForgotPasswordSerializer,
    ResetPasswordSerializer
)

class ForgotPasswordAPIView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email not found"}, status=404)

        token_obj = PasswordResetToken.objects.create(user=user)

        reset_link = f"http://localhost:5173/reset-password/{token_obj.token}"

        send_mail(
            subject="Forgot Password - PSL System",
            message=f"Click the link to reset your password:\n{reset_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Password reset email sent"}, status=200)


class ResetPasswordAPIView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data["token"]
        new_password = serializer.validated_data["new_password"]

        try:
            token_obj = PasswordResetToken.objects.get(token=token)
        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid token"}, status=400)

        if token_obj.is_expired():
            token_obj.delete()
            return Response({"error": "Token expired"}, status=400)

        user = token_obj.user
        user.password = new_password
        user.save()

        token_obj.delete()

        return Response({"message": "Password reset successful"}, status=200)
