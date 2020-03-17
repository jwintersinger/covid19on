import argparse
import pandas as pd
import datetime

def main():
  parser = argparse.ArgumentParser(
    description='LOL HI THERE',
    formatter_class=argparse.ArgumentDefaultsHelpFormatter
  )
  parser.add_argument('infn')
  parser.add_argument('outfn')
  args = parser.parse_args()

  cases = pd.read_csv(args.infn, parse_dates=['date_report'], date_parser=lambda D: datetime.datetime.strptime(D, '%d-%m-%Y'))
  cases = cases.sort_values(by=['date_report'], ascending=False)
  cases = cases[cases['province'] == 'Ontario']

  cases_by_date = cases.groupby('date_report').size()
  cases_by_date = cases_by_date.rename_axis('date')
  total_cases = cases_by_date.cumsum()
  cases_by_date = pd.DataFrame({
    'new_cases': cases_by_date,
    'total_cases': cases_by_date.cumsum(),
  })
  cases_by_date.to_csv(args.outfn)

if __name__ == '__main__':
  main()
