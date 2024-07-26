import pandas as pd
from datetime import timedelta, datetime

class TrainingData:
    def __init__(self, client):
        self.client = client
        self.data = None

    def load_csv(self, file_path):
        print(f"Load Training data from the {file_path} CSV file.")
        self.data = pd.read_csv(file_path, parse_dates=['date'])

    def get_last_date(self):
        return self.data['date'].max()

    def fetch_new_data(self, start_date, end_date):
        new_data = []
        print("Fetch activities from", start_date.date(), "to", end_date.date())
        activities = self.client.get_activities_by_date(start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d'), "running")

        # Order activities by date
        activities.sort(key=lambda x: datetime.strptime(x['startTimeLocal'], '%Y-%m-%d %H:%M:%S'))

        current_date = start_date

        for activity in activities:
            activity_date = datetime.strptime(activity['startTimeLocal'], '%Y-%m-%d %H:%M:%S')

            # For the missing date set TSS=0 and Distance=0.00
            while current_date.date() < activity_date.date():
                new_data.append({'date': current_date.strftime('%Y-%m-%d'), 'distance': 0.00, 'tss': 0})
                current_date += timedelta(days=1)

            # Aggiungi l'attività corrente
            rounded_tss = round(activity['activityTrainingLoad'])
            rounded_distance = round(activity['distance'] / 1000, 2)
            new_data.append({'date': activity_date.strftime('%Y-%m-%d'), 'distance': rounded_distance, 'tss': rounded_tss})
            current_date = activity_date + timedelta(days=1)


        # For the missing date set TSS=0 and Distance=0.00 until the last date
        while current_date.date() <= end_date.date():
            new_data.append({'date': current_date.strftime('%Y-%m-%d'), 'distance': 0.00, 'tss': 0})
            current_date += timedelta(days=1)

        return new_data

    def update_data(self):
        last_date = self.get_last_date()
        today = pd.to_datetime(pd.Timestamp.today().date())
        if today > last_date:
            print(f"Update Training data to the {today.strftime('%Y-%m-%d')} date.")
            new_data = self.fetch_new_data(last_date + timedelta(days=1), today)
            new_data_df = pd.DataFrame(new_data)
            self.data = pd.concat([self.data, new_data_df], ignore_index=True)
        else:
            print("No new data to update. The dataset is already up-to-date.")

    def save_csv(self, file_path):
        print(f"Save Training data to the {file_path} CSV file.")
        # Ensure 'date' column is in datetime format
        self.data['date'] = pd.to_datetime(self.data['date'])
        self.data['date'] = self.data['date'].dt.strftime('%Y-%m-%d')
        self.data.to_csv(file_path, index=False, lineterminator='\n')