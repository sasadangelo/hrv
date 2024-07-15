import pandas as pd
from datetime import timedelta

class HRVData:
    def __init__(self, client):
        self.client = client
        self.data = None

    def load_csv(self, file_path):
        print(f"Load HRV data from the {file_path} CSV file.")
        self.data = pd.read_csv(file_path, parse_dates=['date'])

    def get_last_date(self):
        return self.data['date'].max()

    def fetch_new_data(self, start_date, end_date):
        new_data = []
        for date in pd.date_range(start=start_date, end=end_date):
            try:
                data = self.client.get_hrv_data(date.strftime('%Y-%m-%d'))
                if (data != None):
                    if 'hrvSummary' in data and 'lastNightAvg' in data['hrvSummary']:
                        new_data.append({'date': date.strftime('%Y-%m-%d'), 'rmssd': data['hrvSummary']['lastNightAvg']})
                else:
                    print(f"No data available for the date {date.strftime('%Y-%m-%d')}")
            except Exception as e:
                print(f"Error fetching HRV data for {date.strftime('%Y-%m-%d')}: {e}")
        return new_data

    def update_data(self):
        last_date = self.get_last_date()
        today = pd.to_datetime(pd.Timestamp.today().date())
        if today > last_date:
            print(f"Update HRV data to the {today.strftime('%Y-%m-%d')} date.")
            new_data = self.fetch_new_data(last_date + timedelta(days=1), today)
            new_data_df = pd.DataFrame(new_data)
            self.data = pd.concat([self.data, new_data_df], ignore_index=True)
        else:
            print("No new data to update. The dataset is already up-to-date.")

    def save_csv(self, file_path):
        print(f"Save HRV data to the {file_path} CSV file.")
        # Ensure 'date' column is in datetime format
        self.data['date'] = pd.to_datetime(self.data['date'])
        self.data['date'] = self.data['date'].dt.strftime('%Y-%m-%d')
        self.data.to_csv(file_path, index=False)
