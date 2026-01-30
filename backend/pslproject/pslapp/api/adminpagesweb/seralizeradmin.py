from rest_framework import serializers
from ...models import User, Subscriber, UserMessage


# ===============================
# EMPLOYEE (USER) SERIALIZER
# ===============================


class UserSerializer(serializers.ModelSerializer):
    # 1. READ ONLY: Create a NEW field just for displaying the name
    designation_name = serializers.CharField(source='designation.name', read_only=True)

    class Meta:
        model = User
        # 2. Add 'designation' (for ID writing) AND 'designation_name' (for reading)
        fields = ['id', 'name', 'email', 'designation', 'designation_name', 'password', 'cnic']
        
        extra_kwargs = {
            'password': {'write_only': True}, # Hide password from GET response
            'designation': {'required': True} # Force ID to be required for POST
        }


# ===============================
# SUBSCRIBER SERIALIZER
# ===============================
class SubscriberSerializer(serializers.ModelSerializer):
    # We add days_remaining as a readonly field so it shows up in JSON
    days_remaining = serializers.IntegerField(read_only=True)

    class Meta:
        model = Subscriber
        # Added 'password', 'address', 'bform' to match your model
        fields = ['id', 'name', 'email', 'password', 'address', 'phone', 'bform', 'join_date', 'trial', 'trial_days', 'subscription_expiry', 'days_remaining']
        
        # Security: Allow password to be written (POST), but never show it in response (GET)
        extra_kwargs = {
            'password': {'write_only': True}
        }


# ===============================
# MESSAGE SERIALIZER
# ===============================
class UserMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = SubscriberSerializer(read_only=True)

    class Meta:
        model = UserMessage
        fields = ['id', 'sender', 'receiver', 'message', 'sent_at', 'read']


# --- 1. Serializer for Updating Profile ---
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Your specific model
        # These fields match your React frontend state: formData.name, formData.email, formData.phone
        fields = ['name', 'email', 'phone'] 
        
    def validate_email(self, value):
        # Get the user triggering the request
        user = self.context['request'].user
        
        # Check if any OTHER user in YOUR model has this email
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        return value

# --- 2. Serializer for Changing Password ---
class ChangePasswordSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(required=True) # Matches React state name
    newPassword = serializers.CharField(required=True)     # Matches React state name

    def validate_currentPassword(self, value):
        user = self.context['request'].user
        
        # Assuming your custom model still uses Django's password hashing.
        # If you store plain text (not recommended), use: if user.password != value:
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
