from django.urls import path
from .api_view import RegisterAPIView, LoginAPIView, DesignationListAPIView,LogoutAPIView
from .password_reset_views import ForgotPasswordAPIView, ResetPasswordAPIView
from .dashboard.dashboardviews import *
from .adminpagesweb.views import (
    EmployeeToSubscriberMessageAPIView,
    SubscriberMessageHistoryAPIView,
    MarkMessageReadAPIView,EmployeeListAPIView,SubscriberListAPIView,EmployeeDetailAPIView,
    SubscriberDetailAPIView,UserProfileUpdateAPIView,ChangePasswordAPIView)

urlpatterns = [
    # authentication all apis for user
    path('register/', RegisterAPIView.as_view()),
    path('login/', LoginAPIView.as_view()),
    path('designations/', DesignationListAPIView.as_view(), name='designations'),
    path("forgot-password/", ForgotPasswordAPIView.as_view()),
    path("reset-password/", ResetPasswordAPIView.as_view()),
    path('logout/', LogoutAPIView.as_view(), name='logout'),

    ####### dashboard api for admin #######
    path("admin/stats/", AdminDashboardStats.as_view()),
    path("admin/revenue-chart/", RevenueChart.as_view()),
    # path("subscribers/", SubscribersList.as_view()),
    path("send-message/", SendMessage.as_view()),

    ### admin pages apis  #######
    path(
        'messages/send/',
        EmployeeToSubscriberMessageAPIView.as_view(),
        name='send-message'
    ),

    path(
        'messages/subscriber/<int:subscriber_id>/',
        SubscriberMessageHistoryAPIView.as_view(),
        name='subscriber-message-history'
    ),

    path(
        'messages/read/<int:message_id>/',
        MarkMessageReadAPIView.as_view(),
        name='mark-message-read'
    ),
    path('employees/', EmployeeListAPIView.as_view()), #used
    path('subscribers/', SubscriberListAPIView.as_view(), name='subscriber-list'),
    # Edit & Delete (Requires ID) (used)
    path('employees/<int:id>/', EmployeeDetailAPIView.as_view(), name='employee-detail'),
    path('subscribers/<int:id>/', SubscriberDetailAPIView.as_view(), name='subscriber-detail'),

    #setting page updatepassword and profile
    path('profile/update/', UserProfileUpdateAPIView.as_view(), name='profile-update'),
    path('profile/change-password/', ChangePasswordAPIView.as_view(), name='change-password'),

]
