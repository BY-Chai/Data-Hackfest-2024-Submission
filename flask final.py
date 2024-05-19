from dotenv import dotenv_values
from flask import Flask, request, jsonify
import openrouteservice

API_KEY = dotenv_values(".env")["API_KEY"]

app = Flask(__name__)
client = openrouteservice.Client(key=API_KEY)  # Replace with your actual API key

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

def get_coords_for_address(address, user_id):
    # Your existing function to get coordinates from an address
    return [-79.387089, 43.642596]  # Simulated coordinates for example

def reverse_geocode(client, coordinates):
    # Your existing function to reverse geocode coordinates to an address
    return "CN Tower, Toronto, Ontario, Canada"  # Simulated address for example

if __name__ == '__main__':
    app.run(debug=True)
