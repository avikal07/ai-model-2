from rest_framework.response import Response
from rest_framework.decorators import api_view

def calculate_loan_repayment(debt, interest_rate, annual_income):
    if debt > 0 and interest_rate > 0:
        monthly_rate = interest_rate / 100 / 12
        months = 12  # Assuming a 1-year repayment plan
        monthly_payment = (debt * monthly_rate) / (1 - (1 + monthly_rate) ** -months)
        total_repayment = monthly_payment * months
        return min(total_repayment, annual_income * 0.3)  # Cap at 30% of income
    return 0

@api_view(['POST'])
def financial_recommendation(request):
    salary = request.data.get('salary', 0)
    debt = request.data.get('debt', 0)
    interest_rate = request.data.get('interest_rate', 0)
    
    if not salary or salary <= 0:
        return Response({'error': 'Invalid salary input'}, status=400)
    
    annual_income = salary * 12  # Convert to annual income
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

