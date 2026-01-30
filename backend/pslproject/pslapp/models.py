"""
models.py
Complete database schema for User, Subscriber, Packages, and History management
"""

# -------------------------
# Django Imports
# -------------------------
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils.timezone import now
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
import uuid
from django.db import models
from django.utils import timezone
from datetime import timedelta


# -------------------------
# Python Imports
# -------------------------
import socket
import platform


# ============================================================
# DESIGNATION MODEL
# ============================================================
# Stores roles/designations of system users (Admin, Staff, etc.)
class Designation(models.Model):
    name = models.CharField(
        max_length=255,
        unique=True,
        help_text="Designation name (e.g., Admin, Manager)"
    )

    def __str__(self):
        return self.name


# ============================================================
# USER MODEL (Custom user-like model)
# ============================================================
# Stores system users (not Django default auth user)
class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    cnic = models.CharField(max_length=15,unique=True)

    # Each user has a designation
    designation = models.ForeignKey(
        Designation,
        on_delete=models.CASCADE,
        related_name="users"
    )

    # Hash password before saving
    def save(self, *args, **kwargs):
        if self.password and not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    # Check password manually
    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return self.name


#### password reset token ####
class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=15)

    def __str__(self):
        return f"{self.user.email} - {self.token}"

# ============================================================
# USER ADDRESS MODEL
# ============================================================
# Allows one user to have multiple addresses
class UserAddress(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="addresses"
    )
    address = models.TextField()

    def __str__(self):
        return f"{self.user.name} - Address"


# ============================================================
# USER LOGIN HISTORY MODEL
# ============================================================
# Stores login activity of users
class UserHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="histories"
    )

    login_date = models.DateField(auto_now_add=True)
    login_time = models.TimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.CharField(max_length=255, null=True, blank=True)
    total_time = models.DurationField(null=True, blank=True)

    # Automatically capture IP and device info
    def save(self, *args, **kwargs):
        if not self.ip_address:
            try:
                self.ip_address = socket.gethostbyname(socket.gethostname())
            except:
                self.ip_address = "0.0.0.0"

        if not self.device_info:
            self.device_info = f"{platform.system()} {platform.release()}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.name} - {self.login_date}"


# ============================================================
# SUBSCRIBER MODEL
# ============================================================
# Stores customers/subscribers of the system
class Subscriber(models.Model):
    TRIAL_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.BigIntegerField()
    bform = models.BigIntegerField()
    join_date = models.DateField(auto_now_add=True)
    trial = models.CharField(max_length=3, choices=TRIAL_CHOICES, default='no')

    # ⭐ Subscription fields
    trial_days = models.PositiveIntegerField(default=0)
    subscription_expiry = models.DateField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # 1. Check if this is a new record (Create vs Update)
        is_new = self.pk is None 

        # 2. Hash Password (Optimized)
        # We only hash if it's a raw password (doesn't start with pbkdf2_)
        if self.password and not self.password.startswith("pbkdf2_"):
            self.password = make_password(self.password)
            
            # ⚠️ CRITICAL FIX: If saving specific fields, ensure 'password' is included
            if 'update_fields' in kwargs and kwargs['update_fields']:
                # Convert to set to avoid duplicates, add 'password', convert back to list
                kwargs['update_fields'] = list(set(kwargs['update_fields']) | {'password'})

        # 3. Auto 7-Day Trial (Only for New Users)
        if is_new:
            self.trial = "yes"
            self.trial_days = 7
            self.subscription_expiry = now().date() + timedelta(days=7)
            # Note: We don't need to fix 'update_fields' here because 
            # 'update_fields' is rarely used during creation (insert).

        # 4. Call the real save method with safe arguments
        super().save(*args, **kwargs)

    @property
    def days_remaining(self):
        if not self.subscription_expiry:
            return 0
        
        # Calculate difference safely
        today = now().date()
        expiry = self.subscription_expiry
        
        # Ensure we are subtracting date from date
        delta = (expiry - today).days
        return delta if delta > 0 else 0

    def __str__(self):
        return self.name


# ============================================================
# PACKAGE MODEL
# ============================================================
# Stores subscription packages
class Package(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.PositiveIntegerField(null=True, blank=True)
    discount = models.PositiveIntegerField(default=0)
    duration = models.PositiveIntegerField(
        help_text="Package duration in days"
    )

    @property
    def discounted_price(self):
        """
        Safely calculate discounted price.
        Admin add page par error se bachata hai.
        """
        if self.price is None or self.discount is None:
            return 0

        return self.price - (self.price * self.discount // 100)

    def __str__(self):
        return f"{self.name} - Rs {self.discounted_price}"

# ============================================================
# SUBSCRIBER LOGIN HISTORY
# ============================================================
# Tracks subscriber login sessions
class SubHistory(models.Model):
    subscriber = models.ForeignKey(
        Subscriber,
        on_delete=models.CASCADE,
        related_name="histories"
    )

    login_date = models.DateField(auto_now_add=True)
    login_time = models.TimeField(auto_now_add=True)
    ip_address = models.CharField(max_length=50, blank=True)
    device_info = models.CharField(max_length=255, blank=True)
    duration = models.PositiveIntegerField(
        help_text="Session duration in minutes"
    )

    def save(self, *args, **kwargs):
        if not self.ip_address:
            self.ip_address = socket.gethostbyname(socket.gethostname())
        if not self.device_info:
            self.device_info = f"{platform.system()} {platform.release()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subscriber.name} - {self.login_date}"


# ============================================================
# SUBSCRIBER TRIAL DURATION
# ============================================================
# Manages trial period countdown
class SubTrialDuration(models.Model):
    subscriber = models.ForeignKey(
        Subscriber,
        on_delete=models.CASCADE,
        related_name="trial_info"
    )

    trial_duration = models.PositiveIntegerField(
        help_text="Total trial days"
    )
    days_left = models.IntegerField(default=0)
    last_checked = models.DateTimeField(auto_now=True)

    # Update remaining days and send alert if expired
    def update_days_left(self):
        days_passed = (now() - self.last_checked).days
        if days_passed > 0:
            self.days_left -= days_passed
            self.save()

            if self.days_left <= 0:
                self.send_alert()

    # Email alert when trial ends
    def send_alert(self):
        send_mail(
            subject="Trial Ended",
            message=f"Dear {self.subscriber.name}, your trial period has ended.",
            from_email="noreply@example.com",
            recipient_list=[self.subscriber.email],
            fail_silently=True
        )

    def __str__(self):
        return f"{self.subscriber.name} - {self.days_left} days left"


# ============================================================
# SUBSCRIBER PACKAGE MODEL
# ============================================================
# Connects subscribers with purchased packages

class SubPackage(models.Model):
    subscriber = models.ForeignKey(
        Subscriber,
        on_delete=models.CASCADE,
        related_name="packages"
    )

    package = models.ForeignKey(
        Package,
        on_delete=models.CASCADE,
        related_name="subscribers"
    )

    start_date = models.DateField(default=now)
    expiry_date = models.DateField(editable=False,default=timezone.now)

    def save(self, *args, **kwargs):
        # 🚫 Prevent overlapping active package
        active_package = SubPackage.objects.filter(
            subscriber=self.subscriber,
            expiry_date__gte=now().date()
        ).exclude(id=self.id).exists()

        if active_package:
            raise ValueError("Subscriber already has an active package")

        # ⏳ Auto expiry calculation
        self.expiry_date = self.start_date + timedelta(days=self.package.duration)

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subscriber.name} → {self.package.name}"
    
# ============================================================
# NOTES
# ============================================================
class Note(models.Model):
    notedate = models.DateField()
    notesentense = models.TextField()
    notename = models.CharField(max_length=255)

    def __str__(self):
        return self.notename


class NoteSub(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="note_users")
    subscriber = models.ForeignKey('Subscriber', on_delete=models.CASCADE, related_name="notes_subscribed")

    def __str__(self):
        return f"{self.subscriber.name} → {self.note.notename}"


# ============================================================
# PAYMENT
# ============================================================
class Payment(models.Model):
    bankname = models.CharField(max_length=255)
    receipt = models.URLField()
    package = models.ForeignKey('Package', on_delete=models.CASCADE, related_name="payments")
    subscriber = models.ForeignKey('Subscriber', on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.subscriber.name} → {self.package.name} ({self.amount})"


# ============================================================
# PAYMENT USER APPROVAL
# ============================================================
class PaymentSub(models.Model):
    APPROVAL_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No')
    ]

    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="payment_users")
    subscriber = models.ForeignKey('Subscriber', on_delete=models.CASCADE, related_name="payment_status")
    approved = models.CharField(max_length=3, choices=APPROVAL_CHOICES, default='no')

    def __str__(self):
        return f"{self.subscriber.name} → {self.payment.package.name} ({self.approved})"

# ============================================================
# REVENUE MODEL
# ============================================================
class Revenue(models.Model):
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE, related_name="revenues")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def calculate_total(self):
        # Sum of all approved payments for this subscriber
        total = Payment.objects.filter(
            subscriber=self.subscriber,
            payment_users__approved='yes'
        ).aggregate(models.Sum('amount'))['amount__sum'] or 0
        self.total_amount = total
        self.save()

    def __str__(self):
        return f"{self.subscriber.name} - Total Revenue: Rs {self.total_amount}"


# ============================================================
# USER TO SUBSCRIBER MESSAGE MODEL
# ============================================================
class UserMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    receiver = models.ForeignKey(Subscriber, on_delete=models.CASCADE, related_name="received_messages")
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.sender.name} → {self.receiver.name} ({'Read' if self.read else 'Unread'})"

####websitecontact###

class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    contact_number = models.CharField(max_length=20)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"
