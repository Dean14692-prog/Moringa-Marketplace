#!/bin/bash

COMPONENTS_DIR="src/components"
SEARCH_DIR="src"

echo "Fixing import paths to PascalCase..."

# Loop through all .jsx files in the components directory
for file in "$COMPONENTS_DIR"/*.jsx; do
  filename=$(basename -- "$file")
  pascal="${filename%.*}"  # Without extension
  kebab=$(echo "$pascal" | tr '[:upper:]' '[:lower:]')

  # Search and replace all ./components/kebab → ./components/PascalCase
  grep -rl "./components/$kebab" "$SEARCH_DIR" | while read -r match; do
    echo "Updating import in: $match"
    sed -i "s|./components/$kebab|./components/$pascal|g" "$match"
  done
done

echo "✅ All matching imports have been updated."
