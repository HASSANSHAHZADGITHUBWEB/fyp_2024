from rest_framework import serializers
from ...models import Subscriber, Payment, Revenue, UserMessage, User

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    subscriber_name = serializers.CharField(source="subscriber.name", read_only=True)
    package_name = serializers.CharField(source="package.name", read_only=True)

    class Meta:
        model = Payment
        fields = "__all__"


class RevenueSerializer(serializers.ModelSerializer):
    subscriber_name = serializers.CharField(source="subscriber.name", read_only=True)

    class Meta:
        model = Revenue
        fields = "__all__"


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.name", read_only=True)
    receiver_name = serializers.CharField(source="receiver.name", read_only=True)

    class Meta:
        model = UserMessage
        fields = "__all__"
