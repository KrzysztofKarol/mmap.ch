curl \
  'https://www.museums.ch/en/museums/museum-finder/search-results.html' \
  --compressed \
  --data-raw 'bleibleer=&museensearch%5Bart%5D=museum&submitbtn=Museum+search&museensearch%5Bpass%5D=on' \
  > searchResults.html