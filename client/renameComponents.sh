#!/bin/bash

COMPONENTS_DIR="src/components"

# Loop through all .jsx files in the components directory
for file in "$COMPONENTS_DIR"/*.jsx; do
  filename=$(basename -- "$file")
  extension="${filename##*.}"
  name="${filename%.*}"

  # Skip already PascalCase
  if [[ $name =~ [A-Z] ]]; then
    continue
  fi

  # Convert to PascalCase: e.g., navbar -> Navbar
  pascal=$(echo "$name" | sed -E 's/(^|_)([a-z])/\U\2/g')
  new_file="$COMPONENTS_DIR/$pascal.$extension"

  # Rename the file
  echo "Renaming $file -> $new_file"
  mv "$file" "$new_file"
done
