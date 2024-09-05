class Product(models.Model):
    product_code = models.CharField(max_length=15)
    product_name = models.CharField(max_length=250)
    product_price = models.FloatField()
    product_status = models.CharField(max_length=11, default='0')
    product_stock = models.IntegerField(default=0)
