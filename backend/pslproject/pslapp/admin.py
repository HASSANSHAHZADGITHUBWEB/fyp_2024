from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Designation, User, UserAddress, UserHistory,
    Subscriber, SubHistory, SubTrialDuration,
    Package, SubPackage,
    Note, NoteSub,
    Payment, PaymentSub, Revenue,
    UserMessage, ContactMessage, PasswordResetToken
)

# ============================================================
# 1. INLINES
# ============================================================

class UserAddressInline(admin.StackedInline):
    model = UserAddress
    extra = 0

class PaymentSubInline(admin.StackedInline):
    model = PaymentSub
    extra = 0
    can_delete = False
    verbose_name = "Approval Status"
    verbose_name_plural = "Approval Status"

class SubTrialInline(admin.StackedInline):
    model = SubTrialDuration
    extra = 0
    readonly_fields = ('last_checked',)

class SubPackageInline(admin.TabularInline):
    model = SubPackage
    extra = 0
    readonly_fields = ('expiry_date',)

class RevenueInline(admin.TabularInline):
    model = Revenue
    extra = 0
    readonly_fields = ('total_amount', 'last_updated')

# ============================================================
# 2. MAIN ADMIN REGISTRATIONS
# ============================================================

@admin.register(Designation)
class DesignationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'cnic', 'designation')
    search_fields = ('name', 'email', 'cnic')
    list_filter = ('designation',)
    inlines = [UserAddressInline]

@admin.register(UserHistory)
class UserHistoryAdmin(admin.ModelAdmin):
    list_display = ('user', 'login_date', 'login_time', 'ip_address')
    list_filter = ('login_date',)

# --- SUBSCRIBER MANAGEMENT ---
@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    # Added 'status_badge' to list_display
    list_display = ('name', 'email', 'phone', 'status_badge', 'trial_status', 'join_date')
    search_fields = ('name', 'email', 'phone', 'bform')
    list_filter = ('trial', 'join_date')
    inlines = [SubTrialInline, SubPackageInline, RevenueInline]

    # FIX 1: Removed f-string, using {} placeholders
    def trial_status(self, obj):
        color = 'green' if obj.trial == 'no' else 'orange'
        return format_html(
            '<span style="color:{}; font-weight:bold;">{}</span>',
            color,
            obj.get_trial_display()
        )
    trial_status.short_description = "Trial Mode"

    # FIX 2: Removed f-string
    def status_badge(self, obj):
        # Assuming you have an is_active field (from my previous models.py suggestion)
        # If you don't have is_active in models, remove this function from list_display
        status = getattr(obj, 'is_active', True) 
        color = 'green' if status else 'red'
        return format_html(
            '<span style="color:white; background:{}; padding:3px 6px; border-radius:3px;">{}</span>',
            color,
            status
        )
    status_badge.short_description = "Active"

@admin.register(SubHistory)
class SubHistoryAdmin(admin.ModelAdmin):
    list_display = ('subscriber', 'login_date', 'login_time', 'ip_address')
    list_filter = ('login_date',)

# --- PACKAGES ---
@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'discount', 'discounted_price', 'duration')
    list_filter = ('duration',)

# --- NOTES ---
@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ('notename', 'notedate')
    list_filter = ('notedate',)

@admin.register(NoteSub)
class NoteSubAdmin(admin.ModelAdmin):
    list_display = ('subscriber', 'note')
    search_fields = ('subscriber__name', 'note__notename')

# --- PAYMENTS ---
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('subscriber', 'package', 'amount', 'get_status', 'receipt_link', 'created_at')
    search_fields = ('subscriber__name', 'package__name', 'bankname')
    list_filter = ('created_at',)
    inlines = [PaymentSubInline]

    # FIX 3: Removed f-string
    def get_status(self, obj):
        status_obj = obj.payment_users.first()
        if status_obj:
            color = 'green' if status_obj.approved == 'yes' else 'red'
            return format_html(
                '<b style="color:{}">{}</b>',
                color,
                status_obj.get_approved_display()
            )
        return "Pending"
    get_status.short_description = 'Approval Status'

    # FIX 4: Removed f-string
    def receipt_link(self, obj):
        if obj.receipt:
            return format_html(
                '<a href="{}" target="_blank">View Receipt</a>',
                obj.receipt
            )
        return "No Receipt"
    receipt_link.short_description = "Proof"

@admin.register(PaymentSub)
class PaymentSubAdmin(admin.ModelAdmin):
    list_display = ('subscriber', 'payment', 'approved')
    list_filter = ('approved',)

# --- REVENUE ---
@admin.register(Revenue)
class RevenueAdmin(admin.ModelAdmin):
    list_display = ('subscriber', 'total_amount', 'last_updated')
    list_filter = ('last_updated',)

# --- MESSAGING ---
@admin.register(UserMessage)
class UserMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'sent_at', 'read')
    list_filter = ('read', 'sent_at')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    list_filter = ('created_at',)

@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'is_expired')