import os
import pandas as pd
import datetime
from garminconnect import Garmin
from hrv import HRVData
from fcrest import FCRestData
from tss import TSSData
from garth.exc import GarthHTTPError
import requests
from garminconnect import (
    Garmin,
    GarminConnectAuthenticationError,
    GarminConnectConnectionError,
    GarminConnectTooManyRequestsError,
)
from dotenv import load_dotenv

# Load the EMAIL and PASSWORD from the .env file
load_dotenv()
EMAIL = os.getenv("GARMIN_EMAIL")
PASSWORD = os.getenv("GARMIN_PASSWORD")

tokenstore = os.getenv("GARMINTOKENS") or "~/.garminconnect"
tokenstore_base64 = os.getenv("GARMINTOKENS_BASE64") or "~/.garminconnect_base64"

def main():
    try:
        print(f"Trying to login to Garmin Connect using token data from directory '{tokenstore}'...\n")

        client = Garmin()
        client.login(tokenstore)
    except (FileNotFoundError, GarthHTTPError, GarminConnectAuthenticationError):
        print(
            "Login tokens not present, login with your Garmin Connect credentials to generate them.\n"
            f"They will be stored in '{tokenstore}' for future use.\n"
        )
        try:
            # Authenticate with Garmin Connect
            client = Garmin(EMAIL, PASSWORD)
            client.login()
            # Save Oauth1 and Oauth2 token files to directory for next login
            client.garth.dump(tokenstore)
            print(f"Oauth tokens stored in '{tokenstore}' directory for future use. (first method)\n")
            # Encode Oauth1 and Oauth2 tokens to base64 string and safe to file for next login (alternative way)
            token_base64 = client.garth.dumps()
            dir_path = os.path.expanduser(tokenstore_base64)
            with open(dir_path, "w") as token_file:
                token_file.write(token_base64)
            print(f"Oauth tokens encoded as base64 string and saved to '{dir_path}' file for future use. (second method)\n")
        except (FileNotFoundError, GarthHTTPError, GarminConnectAuthenticationError, requests.exceptions.HTTPError) as err:
            print(err)
            return None

    # Load and update HRV data
    hrv = HRVData(client)
    hrv.load_csv('data/hrv_data.csv')
    hrv.update_data()
    hrv.save_csv('data/hrv_data.csv')

    # Load and update FC Rest data
    fcrest = FCRestData(client)
    fcrest.load_csv('data/fcr_data.csv')
    fcrest.update_data()
    fcrest.save_csv('data/fcr_data.csv')

    # Load and update TSS data
    tss = TSSData(client)
    tss.load_csv('data/tss_data.csv')
    tss.update_data()
    tss.save_csv('data/tss_data.csv')

    print("CSV files updated successfully.")

if __name__ == "__main__":
    main()
