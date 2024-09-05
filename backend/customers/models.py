from django.db import models

class Customer(models.Model):
    customer_name = models.CharField(max_length=200)
