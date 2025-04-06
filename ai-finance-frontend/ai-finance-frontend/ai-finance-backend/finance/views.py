# Core Django and REST imports
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view

# API Integrations
from finance.gemini_api import get_financial_recommendations
from finance.vertex_ai import get_vertex_predictions


@api_view(['GET'])
def generate_recommendations(request):
    user_data = {"income": 50000, "expenses": 30000, "savings": 10000}
    try:
        recommendations = get_financial_recommendations(user_data)
        return Response({"recommendations": recommendations})
    except Exception as e:
        return Response({"error": f"Failed to get recommendations: {str(e)}"}, status=500)


def calculate_loan_repayment(debt, interest_rate, annual_income):
    if debt > 0 and interest_rate > 0:
        monthly_rate = interest_rate / 100 / 12
        months = 12
        monthly_payment = (debt * monthly_rate) / (1 - (1 + monthly_rate) ** -months)
        
        if monthly_rate == 0:
            monthly_payment = debt / months
        
        total_repayment = monthly_payment * months
        return min(total_repayment, annual_income * 0.3)
    return 0


@api_view(['POST'])
def vertex_ai_predictions(request):
    input_data = request.data.get('input_data', {})
    endpoint_name = "projects/YOUR_PROJECT_ID/locations/us-central1/endpoints/YOUR_ENDPOINT_ID"
    
    if not input_data:
        return Response({"error": "Input data is required"}, status=400)
    
    try:
        predictions = get_vertex_predictions(endpoint_name, input_data)
        return Response({"predictions": predictions})
    except Exception as e:
        return Response({"error": f"Failed to get Vertex AI predictions: {str(e)}"}, status=500)


@api_view(['POST'])
def financial_recommendation(request):
    salary = request.data.get('salary', 0)
    debt = request.data.get('debt', 0)
    interest_rate = request.data.get('interest_rate', 0)
    
    if not salary or salary <= 0:
        return Response({'error': 'Invalid salary input'}, status=400)
    
    annual_income = salary * 12
    emergency_fund = annual_income * 0.15
    loan_repayment = calculate_loan_repayment(debt, interest_rate, annual_income)
    remaining_income = annual_income - emergency_fund - loan_repayment
    
    healthcare = remaining_income * 0.15
    savings = remaining_income * 0.25
    stocks = remaining_income * 0.35
    expenditure = remaining_income * 0.25
    
    allocation = {
        'Emergency Fund': round(emergency_fund, 2),
        'Loan Repayment': round(loan_repayment, 2),
        'Healthcare': round(healthcare, 2),
        'Savings': round(savings, 2),
        'Stocks/Investments': round(stocks, 2),
        'Expenditure': round(expenditure, 2),
    }
    
    return Response({'allocation': allocation})
