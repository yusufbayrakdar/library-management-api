#!/bin/bash

grep SERVICE_ENV .env 2>/dev/null
# List all *.env files in the current directory
echo "Available environment files:"
env_files=(*.env)

# Check if any *.env files exist
if [ ${#env_files[@]} -eq 0 ]; then
  echo "No *.env files found!"
  exit 1
fi

# Display the available options
for i in "${!env_files[@]}"; do
  echo "$((i+1))) ${env_files[i]}"
done

# Prompt user to select a file or press 'q' to quit
while true; do
  read -p "Select an environment file by number (or 'q' to quit): " choice

  if [[ $choice == "q" ]]; then
    echo "Exiting the script."
    exit 0
  elif [[ $choice =~ ^[0-9]+$ ]] && (( choice >= 1 && choice <= ${#env_files[@]} )); then
    selected_file="${env_files[choice-1]}"
    # Copy the selected file to .env
    cp "$selected_file" .env
    echo "$selected_file copied to .env"
    break
  else
    echo "Invalid selection, please try again."
  fi
done
