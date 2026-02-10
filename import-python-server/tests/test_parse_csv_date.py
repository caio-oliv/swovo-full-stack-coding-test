from datetime import date

from app.services.type_parser import parse_csv_date

def test_parse_csv_date_valid_1():
	exp = parse_csv_date("1/14/2023")
	assert isinstance(exp, date)
