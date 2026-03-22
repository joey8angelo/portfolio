with open("./boot.txt") as f:
    boot = f.read()

lines = boot.splitlines()
lines = [line.strip() for line in lines]
lines = [line for i, line in enumerate(lines) if i % 3 == 0]

emptyLines = [i for i, line in enumerate(lines) if line.startswith("[]")]
numEmptyLines = len(emptyLines)


for i, lineNum in enumerate(emptyLines):
    line = lines[lineNum]
    lines[lineNum] = line.replace("[]", f"[ {int(((i+1)/numEmptyLines)*100):0{3}d}% ]")

with open("./boot_p.txt", "w") as f:
    f.write("\n".join(lines))
