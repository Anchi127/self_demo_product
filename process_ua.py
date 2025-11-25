
import pandas as pd
import re

def process_functionalities(input_csv_path, output_csv_path):
    """
    Reads a CSV file, splits rows with multiple functionalities,
    and creates a new CSV file with atomic functionalities.
    """
    df = pd.read_csv(input_csv_path)
    new_rows = []
    
    for index, row in df.iterrows():
        functionalities = str(row['功能点'])
        scenarios = str(row['使用场景'])
        
        # Split functionalities by common delimiters.
        # This regex splits by '、', '和', '与', and spaces.
        func_list = re.split(r'[、和与\s]\s*', functionalities)
        
        if len(func_list) > 1:
            # If there are multiple functionalities, we try to split scenarios.
            # This is a best-effort approach. We'll assume scenarios are also delimited.
            scenario_list = re.split(r'[、和与\s]\s*', scenarios)

            # Clean up empty strings from lists
            func_list = [f.strip() for f in func_list if f.strip()]
            scenario_list = [s.strip() for s in scenario_list if s.strip()]

            # If the number of functionalities and scenarios match, we map them 1:1
            if len(func_list) == len(scenario_list):
                for i in range(len(func_list)):
                    new_row = row.copy()
                    new_row['功能点'] = func_list[i]
                    new_row['使用场景'] = scenario_list[i]
                    new_rows.append(new_row)
            else:
                # If they don't match, we'll assign the full scenario list to each new function
                # and add a note that it needs manual review.
                for func in func_list:
                    new_row = row.copy()
                    new_row['功能点'] = func
                    new_row['使用场景'] = scenarios + " (Needs Review)"
                    new_rows.append(new_row)
        else:
            # If there's only one functionality, we just append the original row.
            new_rows.append(row)
            
    new_df = pd.DataFrame(new_rows)
    new_df.to_csv(output_csv_path, index=False, encoding='utf-8')
    print(f"Processed file saved to {output_csv_path}")

if __name__ == "__main__":
    process_functionalities('user_setting/txt_file/UA功能点.csv', 'user_setting/txt_file/UA功能点_atomic.csv')
