from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils.timezone import now
from ...models import Subscriber, Payment, Revenue, UserMessage
from .dashboardserializer import *

class AdminDashboardStats(APIView):
    def get(self, request):
        total_subscribers = Subscriber.objects.count()
        total_revenue = Payment.objects.filter(
            payment_users__approved='yes'
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        monthly_revenue = Payment.objects.filter(
            created_at__month=now().month,
            payment_users__approved='yes'
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        return Response({
            "total_subscribers": total_subscribers,
            "total_revenue": total_revenue,
            "monthly_revenue": monthly_revenue
        })


class RevenueChart(APIView):
    def get(self, request):
        data = Payment.objects.filter(
            payment_users__approved='yes'
        ).extra(select={'month': "strftime('%%m', created_at)"}).values('month') \
         .annotate(total=Sum('amount'))

        return Response(data)


class SubscribersList(APIView):
    def get(self, request):
        subs = Subscriber.objects.all()
        serializer = SubscriberSerializer(subs, many=True)
        return Response(serializer.data)


class SendMessage(APIView):
    def post(self, request):
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"message": "Message sent successfully"})
