from django.urls import path # type: ignore
from .views import financial_recommendation

urlpatterns = [
    path("recommend/", financial_recommendation, name="recommend"),
]
