import os
import pandas as pd
from flask import Flask, request, jsonify
import openrouteservice as ors
import database as db
import sqlite3
from dotenv import dotenv_values

# Securely fetch the API key from environment variables
API_KEY = dotenv_values(".env")["API_KEY"]

user_registration_data = {"user1": {"city": "Toronto", "state": "Ontario", "country": "CAN"},"user2": {"city": "Vancouver", "state": "British Columbia", "country": "CAN"}}

#user_registration_data = {}

app = Flask(__name__)
client = ors.Client(key=API_KEY)


@app.route('/add_user', methods=['POST', 'GET', 'CONNECT'])
def add_user():
    data = request.json()
    try:
        with db.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO users (name, pw, city, state, country, routes) VALUES (?, ?, ?, ?, ?, ?)",
                           (data['name'], data['pw'], data['city'], data['state'], data['country'], '{"type": "FeatureCollection", "features": []}'))
            conn.commit()
        return jsonify({'message': 'User added successfully'}), 201
    except sqlite3.IntegrityError as e:
        return jsonify({'error': 'User could not be added', 'message': str(e)}), 400

@app.route('/get_routes/<name>', methods=['GET', 'CONNECT'])
def get_routes(name):
    try:
        with db.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT routes FROM users WHERE name = ?", (name,))
            routes = cursor.fetchone()
            if routes:
                return jsonify({'routes': routes[0]})
            else:
                return jsonify({'message': 'No routes found'}), 404
    except Exception as e:
        return jsonify({'error': 'Error fetching routes', 'message': str(e)}), 500
    
@app.route('/sign_in', methods=['POST', 'CONNECT'])
def sign_in():
    data = request.json()
    try:
        with db.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT * FROM users WHERE name = {data['name']}")
            user = cursor.fetchone()
            if data['pw'] != user[1]:
                return jsonify({'error': 'Wrong password'}), 401
            
            # Modify backend environment variable to signed-in user's info
            global user_registration_data
            user_registration_data[user[0]] = {"city": user[2], "state": user[3], "country": user[4]}

            return jsonify({'name': user[0], 'city': user[2], 'state': user[3], 'country': user[4]})
    except Exception as e:
        return jsonify({'error': 'Error signing in', 'message': str(e)}), 500


@app.route('/list_users', methods=['POST', 'CONNECT'])
def list_users():
    try:
        with db.get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users")
            users = cursor.fetchall()
            return jsonify([{'name': user[0], 'city': user[2], 'state': user[3], 'country': user[4]} for user in users])
    except Exception as e:
        return jsonify({'error': 'Error listing users', 'message': str(e)}), 500





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

    address = reverse_geocode_function(client, [lon, lat])
    if address:
        return jsonify({"coordinates": [lon, lat], "address": address})
    else:
        return jsonify({"error": "Failed to reverse geocode coordinates"}), 404

@app.route('/get_paths_by_dist', methods=['GET'])
def get_paths_by_dist_function():
    address = request.args.get('address')
    run_distance = request.args.get('run_distance', type=int)
    user_id = request.args.get('user_id')
    is_closed = request.args.get('is_closed', 'false').lower() in ['true', '1', 't']
    n_routes = request.args.get('n_routes', default=5, type=int)
    """
    if (not address) or (run_distance is None) or (not user_id):
        return jsonify({"error": "Missing or invalid parameters", "received_params": request.args.to_dict()}), 400
    """
    routes = get_paths_by_dist(address, run_distance, user_id, is_closed, n_routes)
    if routes:
        return jsonify(routes)
    else:
        return jsonify({"error": "Failed to return routes"}), 404


##################### BACKGROUND FUNCTIONS #####################
def get_coords_for_address(address, user_id):
    """Retrieve coordinates for a given address."""
    
    user_data = user_registration_data.get(user_id)
    if not user_data:
        print(f"No registration data found for user ID '{user_id}'")
        return None

    structured_query = f"{address}, {user_data['city']}, {user_data['state']}, {user_data['country']}"
    try:
        geocode_result = client.pelias_autocomplete(text=structured_query)
        for feature in geocode_result.get('features', []):
            if feature['geometry']['type'] != 'GeometryCollection':
                coords = feature['geometry']['coordinates']
                return coords
        return None
    except Exception as e:
        print(f"Error in geocoding: {str(e)}")
        return None


def reverse_geocode_function(client, coordinates, circle_radius=1, country=None, layers=None):
    """Reverse geocode coordinates to a human-readable address."""
    try:
        params = {'point': coordinates, 'circle_radius': circle_radius, 'country': country, 'layers': layers}
        reverse_geocode_result = client.pelias_reverse(**params)
        address_info = reverse_geocode_result.get('features')
        if address_info:
            return address_info[0]['properties']['label']
        return None
    except Exception as e:
        print(f"Error in reverse geocoding: {str(e)}")
        return None
    

def find_potential_waypoints(start_coords, buffer):
    """Retrieve potential waypoints within a specified buffer around the start coordinates."""
    params = {
        'request': 'pois',
        'geojson': {"type": "point", "coordinates": start_coords},
        'buffer': buffer,  # Buffer in meters
        'sortby': "distance"
    }
    poi_result = client.places(**params)
    return poi_result
    

def find_potential_distances(start_coords: list, run_distance: float, user_id: str):
    # Outputs a matrix of distances from given origin to potential destinations of run
    destinations_addresses = find_potential_waypoints(start_coords, run_distance)
    all_coords = [start_coords] + [feature['geometry']['coordinates'] for feature in destinations_addresses['features']]
    distance_matrix = client.distance_matrix(locations=all_coords, sources=[0], destinations=list(range(1, len(all_coords))), metrics=['distance']) # Ouputs a nested list, so need [0]
    
    # Convert into a pandas Dataframe
    
    latitudes = [coordinate[1] for coordinate in all_coords[1:]]
    longitudes = [coordinate[0] for coordinate in all_coords[1:]]
    osm_ids = [feature['properties']['osm_id'] for feature in destinations_addresses['features']]
    distances = distance_matrix['distances'][0]

    #category_ids = [feature['properties']['category_ids'].keys()[0] for feature in destinations_addresses['features']]
    #category_names = [feature['properties']['category_ids']['category_name'] for feature in destinations_addresses['features']]
    #place_names = [feature['properties']['osm_tags']['name'] for feature in destinations_addresses['features']]

    #output = pd.DataFrame(zip(osm_ids, place_names, distances, coordinates, category_ids, category_names), columns = ['osm_id', 'name', 'distance', 'coordinates', 'category_id', 'category'])
    
    simplified_output = pd.DataFrame(zip(osm_ids, distances, latitudes, longitudes), columns = ['osm_ids', 'distance', 'latitude', 'longitude'])
    #simplified_output.to_csv("CNtowerstart_2000m", encoding='utf-8') # Outputs a local file for testing
    return simplified_output


def filter_potential_endpoints(dist_dataframe, run_distance, n_routes):
    dist_dataframe.sort_values(by=['distance'], ascending=True, ignore_index=True, inplace=True)
    dist_dataframe.reset_index(drop=True, inplace=True)

    # Binary search for range of routes of a distance
    low = 0
    high = dist_dataframe.shape[0]-1
    i = high
    while high-low > 1:
        mid = (low+high)//2
        if dist_dataframe['distance'][mid] == run_distance:
            i = mid
        elif dist_dataframe['distance'][mid] < run_distance:
            low = mid + 1
        else:
            high = mid - 1
    if round(dist_dataframe['distance'][low], -1) == run_distance:
        i = low
    if round(dist_dataframe['distance'][high], -1) == run_distance:
        i = high
    
    dist_dataframe = dist_dataframe[max(i-n_routes//2, 0):min(i+n_routes//2+1, dist_dataframe.shape[0]-1)]
    dist_dataframe.reset_index(drop=True, inplace=True)
    return dist_dataframe


def get_directions(start_coords, end_coords):
    """Retrieve walking directions from start to end coordinates."""
    try:
        directions = client.directions(coordinates=[start_coords, end_coords], profile='foot-walking', format='geojson')
        return directions
    except Exception as e:
        print(f"Error fetching directions: {str(e)}")
        return None
    
def get_paths_by_dist(start_address: str, run_distance: float, user_id, is_closed = False, n_routes = 5):
    start_coords = get_coords_for_address(start_address, user_id)
    if not start_coords:
        print("Could not retrieve start coordinates.")
        return None

    if is_closed: # Halve distance if backtracking
        dist_factor = 2
    else:
        dist_factor = 1
    
    #start_coords = [-79.387089, 43.642596]

    dist_dataframe = find_potential_distances(start_coords, run_distance/dist_factor, user_id)
    best_endpoints = filter_potential_endpoints(dist_dataframe, run_distance=run_distance/dist_factor, n_routes=n_routes)

    if is_closed: # Set up return to start if backtracking
        waypoints = [start_coords, [best_endpoints['longitude'][0], best_endpoints['latitude'][0]], start_coords]
    else:
        waypoints = [start_coords, [best_endpoints['longitude'][0], best_endpoints['latitude'][0]]]

    all_routes = client.directions(coordinates = waypoints, format = 'geojson', profile="foot-walking", instructions = False) # Initialize the geojson dict with the first data entry
    for i in range(1, best_endpoints.shape[0]):
        waypoints[1] = [best_endpoints['longitude'][i], best_endpoints['latitude'][i]]
        route = client.directions(coordinates = waypoints, format = 'geojson', profile="foot-walking", instructions = False)
        all_routes['features'].append(route['features'][0])
    
    return all_routes


if __name__ == '__main__':
    app.run(debug=True)
