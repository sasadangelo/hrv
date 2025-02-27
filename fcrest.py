from datetime import timedelta
import pandas as pd


class FCRestData:
    def __init__(self, client):
        self.client = client
        self.data = None

    def load_csv(self, file_path):
        print(f"Load FCrest data from the {file_path} CSV file.")
        self.data = pd.read_csv(file_path, parse_dates=["date"])

    def get_last_date(self):
        return self.data["date"].max()

    def fetch_new_data(self, start_date, end_date):
        new_data = []
        for date in pd.date_range(start=start_date, end=end_date):
            try:
                data = self.client.get_rhr_day(date.strftime("%Y-%m-%d"))
                if data is not None:
                    if (
                        "allMetrics" in data
                        and "metricsMap" in data["allMetrics"]
                        and "WELLNESS_RESTING_HEART_RATE"
                        in data["allMetrics"]["metricsMap"]
                    ):
                        rhr_list = data["allMetrics"]["metricsMap"][
                            "WELLNESS_RESTING_HEART_RATE"
                        ]
                        for entry in rhr_list:
                            if entry["calendarDate"] == date.strftime("%Y-%m-%d"):
                                new_data.append(
                                    {
                                        "date": date.strftime("%Y-%m-%d"),
                                        "fcr": entry["value"],
                                    }
                                )
                else:
                    print(f"No data available for the date {date.strftime('%Y-%m-%d')}")
            except Exception as e:
                print(
                    f"Error fetching FC Rest data for {date.strftime('%Y-%m-%d')}: {e}"
                )
        return new_data

    def update_data(self):
        last_date_str = self.get_last_date()  # Assuming this returns a string
        last_date = pd.to_datetime(last_date_str)  # Convert the string to a Timestamp
        today = pd.to_datetime(pd.Timestamp.today().date())
        if today > last_date:
            print(f"Update FCR data to the {today.strftime('%Y-%m-%d')} date.")
            new_data = self.fetch_new_data(last_date + timedelta(days=1), today)
            new_data_df = pd.DataFrame(new_data)
            self.data = pd.concat([self.data, new_data_df], ignore_index=True)
        else:
            print("No new data to update. The dataset is already up-to-date.")

    def save_csv(self, file_path):
        print(f"Save HRV data to the {file_path} CSV file.")
        # Ensure 'date' column is in datetime format
        self.data["date"] = pd.to_datetime(self.data["date"])
        # Gestisci valori non validi
        if self.data["fcr"].isnull().any():
            print("Warning: Found NaN values in 'fcr'. Filling with 0.")
            self.data["fcr"] = self.data["fcr"].fillna(0)

        # Converte in interi, gestendo eventuali float
        self.data["fcr"] = self.data["fcr"].astype(int)
        self.data["date"] = self.data["date"].dt.strftime("%Y-%m-%d")
        # self.data.to_csv(file_path, index=False)
        self.data.reset_index(drop=True).to_csv(file_path, index=False)
