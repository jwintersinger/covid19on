cases_url='https://docs.google.com/spreadsheets/d/1D6okqtBS3S2NRC7GFVHzaZ67DuTw7LX49-fqSLwJyeo/export?format=csv&id=1D6okqtBS3S2NRC7GFVHzaZ67DuTw7LX49-fqSLwJyeo&gid=942958991' 
curl --silent "$cases_url" | tail -n+2 | python3 munge_case_data.py cases.csv
