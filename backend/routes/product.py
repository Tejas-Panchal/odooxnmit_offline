from flask import Blueprint, request, jsonify
from models.product import Product
from models.tax import Tax
import requests
import json

product_bp = Blueprint("product", __name__)


@product_bp.route("/get_hsn_code", methods=["GET"])
def get_hsn_code():
    search_text = request.args.get("inputText")
    search_type = request.args.get("type", "byDesc")
    category = "null"

    # --- Validation ---
    if not search_text:
        return jsonify({"error": "The 'query' parameter is required."}), 400

    if search_type not in ["byCode", "byDesc"]:
        return jsonify({"error": "Invalid 'type' parameter. Use 'byCode' or 'byDesc'."}), 400

    # --- Smart Category Selection ---
    if search_type == "byDesc":
        category = "P"

    # --- API Call ---
    url = "https://services.gst.gov.in/commonservices/hsn/search/qsearch"
    params = {
        "inputText": search_text,
        "selectedType": search_type,
        "category": category
    }
    
    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-US,en;q=0.5",
        "Origin": "https://services.gst.gov.in",
        "Referer": "https://services.gst.gov.in/services/search-hsn-sac",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
    }

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        return jsonify(data)

    except requests.exceptions.HTTPError as e:
        try:
            error_data = e.response.json()
            return jsonify(error_data), e.response.status_code
        except json.JSONDecodeError:
            return jsonify({"error": "HTTP error from GST Portal", "details": str(e)}), e.response.status_code
            
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Could not connect to GST Portal", "details": str(e)}), 503
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid response from GST Portal, could not decode JSON."}), 500

@product_bp.route("/creare_product", methods=["POST"])
def create_product():
    data = request.get_json() or {}
    product_name = data.get("product_name")
    type = data.get("product_type")
    sales_price = data.get("sales_price")
    category = data.get("category")
    purchase_price = data.get("purchase_price")
    hsn_code = data.get("hsn_code")
    sales_tax = data.get("sales_tax")
    purchase_tax = data.get("purchase_tax")
    
    if not data or not product_name:
        return jsonify({"msg": "Product name is required"}), 400
    
    sales_tax_id = None
    purchase_tax_id = None
    
    if sales_tax:
        sales_tax_obj = Tax.query.filter_by(tax_name=sales_tax).first()
        if not sales_tax_obj:
            return jsonify({"msg": f"Sales tax '{sales_tax}' not found in the database."}), 404
        sales_tax_id = sales_tax_obj.tax_id
    
    
    product = Product
    return jsonify({"msg": "Product created"}), 201