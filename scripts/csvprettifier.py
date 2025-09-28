import csv
import sys

def print_csv_table(csv_path: str) -> None:
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        table_data = [row for row in reader]

    if not table_data:
        print("The CSV file is empty.")
        return

    column_widths = [max(len(str(item)) for item in col) for col in zip(*table_data)]

    header_format = "| " + " | ".join([f"{{:<{width}}}" for width in column_widths]) + " |"
    print(header_format.format(*table_data[0]))
    print("-" * (sum(column_widths) + len(column_widths) * 3 + 1))

    for row in table_data[1:]:
        print(header_format.format(*row))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <csv_file>")
        sys.exit(1)

    print_csv_table(sys.argv[1])
