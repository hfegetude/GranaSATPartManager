from os import walk
import os
from shutil import copyfile

f = []
for (dirpath, dirnames, filenames) in walk("./datasheets"):
    f.extend(filenames)
    break

f = [x for x in f if x.endswith(".pdf")]

for a in f:
    os.makedirs("./files/"+a.split(".")[0])
    copyfile("./datasheets/"+a,"./files/" + a.split(".")[0] + "/datasheet.pdf")
print(f)
