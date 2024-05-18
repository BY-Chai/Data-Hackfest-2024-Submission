import openrouteservice as ors
import pandas as pd
import json
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from a .env file
API_KEY = os.getenv("ORS_API_KEY")  # Securely fetch your API key from environment variables

app = Flask(__name__)
client = ors.Client(key=API_KEY)

@app.route('/forward_geocode', methods=['GET'])
def forward_geocode():
    address = request.args.get('address')
    user_id = request.args.get('user_id')
    if not address or not user_id:
        return jsonify({"error": "Address and User ID are required"}), 400

    coordinates = get_coords_for_address(address, user_id)
    if coordinates:
        return jsonify({"address": address, "coordinates": coordinates})
    else:
        return jsonify({"error": "Failed to geocode address"}), 404

@app.route('/reverse_geocode', methods=['GET'])
def reverse_geocode():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    if lat is None or lon is None:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    address = reverse_geocode(client, [lon, lat])
    if address:
        return jsonify({"coordinates": [lon, lat], "address": address})
    else:
        return jsonify({"error": "Failed to reverse geocode coordinates"}), 404

# Assumed implementation of get_coords_for_address and reverse_geocode here...

@app.route('/get_paths_by_dist', methods=['GET'])
def get_paths_by_dist_function():
    start_address = request.args.get('start_address')
    run_distance = request.args.get('run_distance', type=float)
    user_id = request.args.get('user_id')
    is_closed = request.args.get('is_closed', type=bool, default=False)
    n_routes = request.args.get('n_routes', type=int, default=10)

    if not start_address or not user_id:
        return jsonify({"error": "Start address and User ID are required"}), 400

    paths = get_paths_by_dist(start_address, run_distance, user_id, is_closed, n_routes)
    if paths:
        return jsonify(paths)
    else:
        return jsonify({"error": "Could not generate paths"}), 500

# Assumed implementation of find_potential_distances, filter_potential_endpoints, and get_paths_by_dist here...

if __name__ == '__main__':
    app.run(debug=True)
