import re
import json

file = open('dump.xml', 'r')
d = dict()
for line in file:
  line = re.sub('[^a-zA-Z0-9\n ]', '', line)
  for word in line.split():
    word = word.lower()
    if len(word) == 5 and word.isalpha():
      if word in d:
        d[word] += 1
      else:
        d[word] = 1

sorted_d = {k: v for k, v in sorted(d.items(), key=lambda item: item[1], reverse=True) if v >= 100}

outfile = open('dictionary.json','w')
# outfile.writelines(json.dumps(list(sorted_d.keys())))
outfile.writelines(json.dumps(sorted_d))
outfile.close()
