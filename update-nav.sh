#!/bin/bash

# Clone the repository if not already done
git clone https://github.com/patpankaj/finance_template.git
cd finance_template

# Add nav.js if it doesn't exist
if [ ! -f nav.js ]; then
    # Create nav.js with the content above
    echo "Creating nav.js..."
    # Copy the nav.js content here
fi

# Update all HTML files
for file in *.html; do
    if [ -f "$file" ]; then
        echo "Updating $file..."
        # Add script tag if not present
        if ! grep -q "nav.js" "$file"; then
            sed -i '/<head>/a \    <script src="nav.js" defer></script>' "$file"
        fi
        
        # Add navbar placeholder if not present
        if ! grep -q "navbar-placeholder" "$file"; then
            sed -i '/<body>/a \    <div id="navbar-placeholder"></div>' "$file"
        fi
    fi
done

# Commit and push changes
git add .
git commit -m "Update navigation across all pages"
git push origin main 