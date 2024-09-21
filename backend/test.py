from datetime import datetime

# Test string
date_str = "2024-09-26"

# Convert to datetime object
date_obj = datetime.strptime(date_str, "%Y-%m-%d")

# Print the result
print(f"Parsed date: {date_obj}")
