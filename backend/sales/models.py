class Sale(models.Model):
    sale_date = models.DateTimeField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    sale_items_total = models.IntegerField(default=0)

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_price = models.FloatField()
    item_qty = models.IntegerField(default=0)
    is_verify = models.BooleanField(default=False)
