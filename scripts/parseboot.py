with open("./boot.txt") as f:
    boot = f.read()

lines = boot.splitlines()

emptyLines = [i for i, line in enumerate(lines) if line.startswith("[]")]
numEmptyLines = len(emptyLines)

for i, lineNum in enumerate(emptyLines):
    line = lines[lineNum]
    lines[lineNum] = line.replace("[]", f"[ {int(((i+1)/numEmptyLines)*100):0{3}d}% ]")

with open("./boot_p.txt", "w") as f:
    f.write("\n".join(lines))
