from django.shortcuts import render,redirect
from django.http import HttpResponse
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from .models import Package,ContactMessage
 ### use for website ###########
@method_decorator(csrf_exempt, name='dispatch')
class HomeView(View):
    def get(self, request):
        # You can pass data to the template in the context dictionary
        package=Package.objects.all()
        context = {
            'Packages':package
        }
        # Note the path includes the subfolder we made
        return render(request, 'website/index.html', context)
    
    def post(self, request):
        # Get data manually from POST request
        name = request.POST.get('name')
        email = request.POST.get('email')
        contact_number = request.POST.get('contact_number')
        message = request.POST.get('message')

        # Save to database
        ContactMessage.objects.create(
            name=name,
            email=email,
            contact_number=contact_number,
            message=message
        )
        messages.success(request, 'Your message has been sent successfully!')
        return redirect('home') 


