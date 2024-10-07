#!/bin/bash

BRANCH_NAME=${1:-master}

# Pull translations
echo "🛠️ Pulling translations from $BRANCH_NAME branch"
lokalise2 \
 --token 4dd34462a622a8d9a294feeddf976bc017d93a33 \
 --project-id 108144176703c7e6803125.68848339:$BRANCH_NAME \
  file download \
  --unzip-to "./locales" \
  --export-sort "first_added" \
  --plural-format i18next \
  --placeholder-format i18n \
  --indentation 4sp \
  --format "json"