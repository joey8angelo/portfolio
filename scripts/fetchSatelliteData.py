import requests
import json


def get_data():
    # visible satellite list
    # url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=visual&FORMAT=JSON"
    # starlink
    url = "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=JSON"
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code}")
    data = response.json()
    return data


if __name__ == "__main__":
    data = get_data()

    with open("satellite_data.json", "w") as f:
        json.dump(data, f, indent=4)
