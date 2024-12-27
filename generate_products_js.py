import json
import sys
sys.path.append('.')
from models.product_data import get_all_products


def generate_js_file():
    products = get_all_products()
    
    # Convert products to list of dictionaries using to_dict method
    products_data = [p.to_dict() for p in products]
    
    # Create JavaScript content
    js_content = f"const products = {json.dumps(products_data, indent=2)};"
    
    # Write to products.js file
    with open('products.js', 'w') as f:
        f.write(js_content)

if __name__ == "__main__":
    generate_js_file()
