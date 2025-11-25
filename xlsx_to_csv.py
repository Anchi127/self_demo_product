
import pandas as pd
import sys

def convert_xlsx_to_csv(xlsx_path, csv_path):
    """
    Converts an XLSX file to a CSV file.
    """
    try:
        df = pd.read_excel(xlsx_path)
        df.to_csv(csv_path, index=False, encoding='utf-8')
        print(f"Successfully converted {xlsx_path} to {csv_path}")
    except Exception as e:
        print(f"Error converting file: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python xlsx_to_csv.py <input.xlsx> <output.csv>", file=sys.stderr)
        sys.exit(1)
    
    input_xlsx = sys.argv[1]
    output_csv = sys.argv[2]
    
    convert_xlsx_to_csv(input_xlsx, output_csv)
