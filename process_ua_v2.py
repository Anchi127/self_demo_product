
import pandas as pd
import re

def is_list_of_items(text):
    """
    A simple heuristic to guess if a string is a list of items rather than a list of actions.
    For example, "Meta、TikTok、Google" is a list of items.
    """
    parts = re.split(r'[、]', text)
    # If the parts are short and don't contain verbs, it's likely a list of items.
    # This is a rough heuristic.
    if all(len(p) < 10 for p in parts) and not any('查看' in p or '支持' in p or '发起' in p for p in parts):
        return True
    return False

def split_scenarios(scenarios, num_funcs):
    """
    Splits the scenario string into a number of parts equal to num_funcs.
    This is a best-effort split.
    """
    # Prioritize splitting by Chinese semicolon, then comma, then space.
    delimiters = ['；', '，', ' ']
    for delimiter in delimiters:
        if delimiter in scenarios:
            scenario_list = [s.strip() for s in scenarios.split(delimiter) if s.strip()]
            if len(scenario_list) == num_funcs:
                return scenario_list
    
    # If no good split is found, duplicate the original scenario for each function.
    return [scenarios] * num_funcs

def process_functionalities_v2(input_csv_path, output_csv_path):
    """
    Reads a CSV file, splits rows with multiple functionalities using improved logic,
    and creates a new CSV file with atomic functionalities.
    """
    df = pd.read_csv(input_csv_path)
    new_rows = []
    
    for index, row in df.iterrows():
        functionality = str(row['功能点'])
        scenario = str(row['使用场景'])
        
        # Define delimiters that separate distinct functions.
        # The '、' is the primary one.
        delimiters = r'、'
        
        # Don't split if it looks like a list of items for a single action.
        if is_list_of_items(functionality):
            new_rows.append(row)
            continue
            
        # Split functionalities. Let's handle some cases manually.
        # A more robust solution might require more specific rules.
        if "、" in functionality:
            # Special case for "筛选、查询"
            if "筛选、查询" in functionality:
                base_text = functionality.replace("筛选、查询", "").strip()
                funcs = ["筛选" + base_text, "查询" + base_text]
                scens = split_scenarios(scenario, 2)
                if len(scens) < 2:
                    scens = [scenario, scenario] # fallback
                
                new_row1 = row.copy()
                new_row1['功能点'] = funcs[0]
                new_row1['使用场景'] = scens[0]
                new_rows.append(new_row1)
                
                new_row2 = row.copy()
                new_row2['功能点'] = funcs[1]
                new_row2['使用场景'] = scens[1]
                new_rows.append(new_row2)
                continue

            func_list = [f.strip() for f in functionality.split('、') if f.strip()]
            if len(func_list) > 1:
                scenarios_list = split_scenarios(scenario, len(func_list))
                for i in range(len(func_list)):
                    new_row = row.copy()
                    new_row['功能点'] = func_list[i]
                    new_row['使用场景'] = scenarios_list[i]
                    new_rows.append(new_row)
            else:
                new_rows.append(row)
        else:
            new_rows.append(row)

    new_df = pd.DataFrame(new_rows)
    # Drop duplicates that might have been created
    new_df = new_df.drop_duplicates()
    new_df.to_csv(output_csv_path, index=False, encoding='utf-8')
    print(f"Processed file saved to {output_csv_path}")

if __name__ == "__main__":
    process_functionalities_v2('user_setting/txt_file/UA功能点.csv', 'user_setting/txt_file/UA功能点_atomic_v2.csv')

