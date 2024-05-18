import openrouteservice as ors
import pandas as pd

# Use a secure method to handle the API key
API_KEY = "key"  # Read from a secure location or environment variable
client = ors.Client(key=API_KEY)

user_registration_data = {
    "user1": {
        "city": "Toronto",
        "state": "Ontario",
        "country": "CAN"
    },
    "user2": {
        "city": "Vancouver",
        "state": "British Columbia",
        "country": "CAN"
    }
    # More users can be added here
}

def get_coords_for_address(address, user_id):
    user_data = user_registration_data.get(user_id)
    if not user_data:
        print(f"No registration data found for user ID '{user_id}'")
        return None

    structured_query = f"{address}, {user_data['city']}, {user_data['state']}, {user_data['country']}"
    print(f"Structured query: '{structured_query}'")

    try:
        geocode_result = client.pelias_autocomplete(text=structured_query)
        for feature in geocode_result.get('features', []):
            if feature['geometry']['type'] == 'Point':
                coords = feature['geometry']['coordinates']
                print(f"Coordinates for '{structured_query}' are {coords}")
                return coords
            else:
                print(f"Skipping unsupported geometry type: {feature['geometry']['type']}")
        print(f"No valid coordinates found for '{structured_query}'.")
        return None
    except Exception as e:
        print(f"Error in geocoding: {str(e)}")
        return None

def find_potential_waypoints(start_coords, buffer):
    try:
        params = {
            'request': 'pois',
            'geojson': {"type": "Point", "coordinates": start_coords},
            'buffer': buffer,
            'sortby': "distance"
        }
        poi_result = client.places(**params)
        return poi_result
    except Exception as e:
        print(f"Error retrieving waypoints: {str(e)}")
        return None

def filter_potential_endpoints(dist_dataframe, run_distance, margin):
    filtered_df = dist_dataframe[
        (dist_dataframe['distance'] <= (run_distance + margin)) &
        (dist_dataframe['distance'] >= (run_distance - margin))
    ]
    return filtered_df.sort_values(by='distance', ascending=True).reset_index(drop=True)

def get_directions(start_coords, end_coords):
    try:
        directions = client.directions(coordinates=[start_coords, end_coords], profile='foot-walking', format='geojson')
        return directions
    except Exception as e:
        print(f"Error fetching directions: {str(e)}")
        return None

# Main execution logic
if __name__ == "__main__":
    user_id = "user1"
    start_address = "CN Tower, Toronto"
    buffer_distance = 2000  # Buffer in meters for finding waypoints

    start_coords = get_coords_for_address(start_address, user_id)
    if start_coords:
        poi_result = find_potential_waypoints(start_coords, buffer_distance)
        if poi_result:
            # Extract necessary information and create DataFrame
            osm_ids = [feature['properties']['osm_id'] for feature in poi_result['features']]
            distances = [feature['properties']['distance'] for feature in poi_result['features']]
            coordinates = [feature['geometry']['coordinates'] for feature in poi_result['features']]
            dist_dataframe = pd.DataFrame(list(zip(osm_ids, distances, coordinates)), columns=['osm_id', 'distance', 'coordinates'])
            filtered_routes = filter_potential_endpoints(dist_dataframe, 1000, 10)
            print(filtered_routes)
        else:
            print("No points of interest found near the start location.")
    else:
        print("Failed to get start coordinates.")
