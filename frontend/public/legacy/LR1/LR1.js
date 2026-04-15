let grammarError = false;
let LRtableError = [false];
let LRparseError = [false];
let LRsm = [null];
let LRstack = [null];
let LRg = [null];
let LRinner = [null];
let LRrender = [null];
let LRtable = [null];
let LRcollapsed = [false];
let LALRtableError = [false];
let LALRparseError = [false];
let LALRsm = [null];
let LALRstack = [null];
let LALRg = [null];
let LALRinner = [null];
let LALRrender = [null];
let LALRtable = [null];
let LALRcollapsed = [false];

//Queue
class Node {
  constructor(v = "", n = null) {
    this.val = v;
    this.next = n;
  }
}

class Queue {
  constructor() {
    this.head = new Node();
    this.tail = this.head;
  }

  enqueue(item) {
    this.tail.next = new Node(item);
    this.tail = this.tail.next;
  }

  dequeue() {
    if (this.tail == this.head) {
      return undefined;
    }
    let v = this.head.next.val;
    this.head.next = this.head.next.next;
    if (this.head.next == null) {
      this.tail = this.head;
    }
    return v;
  }

  join(val = " ") {
    let s = "";
    let curr = this.head;
    while (curr != this.tail) {
      if (curr != this.head) {
        s += val;
      }
      s += curr.next.val;
      curr = curr.next;
    }

    return s;
  }

  empty() {
    return this.head == this.tail;
  }

  peek() {
    return this.head == this.tail ? undefined : this.head.next.val;
  }
}
let LRq = [new Queue()];
let LALRq = [new Queue()];
//end Queue

let grammar = {
  FIRST: function (rule, pos, look) {
    let val = new Set();
    let cont = true;

    for (let i = pos; i < this.rules[rule].length && cont; i++) {
      cont = false;
      let firstSet = this._FIRST.get(this.rules[rule][i]);
      for (let j of firstSet) {
        if (j == "%") {
          cont = true;
        } else {
          val.add(j);
        }
      }
    }
    if (cont) {
      for (i of look) {
        val.add(i);
      }
    }
    return val;
  },
  rules: [],
  nonTerminals: new Set(),
  terminals: new Set(),
  IDS: new Map(),
  _FIRST: new Map(),
  start: "",
  stringRule: function (rule, pos) {
    let s = "";
    s += this.rules[rule][0] + " >";
    for (let i = 1; i < this.rules[rule].length; i++) {
      s += " ";
      if (i == pos) {
        s += ".";
      }
      s += grammar.rules[rule][i];
    }
    if (pos == grammar.rules[rule].length) {
      s += " .";
    }
    return s;
  },
  stringSubsetRule: function (rule, start, end) {
    let s = "";
    if (start < end) {
      s += this.rules[rule][start];
    }
    for (let i = start + 1; i < end; i++) {
      s += " " + this.rules[rule][i];
    }
    return s;
  },
};

class State {
  constructor(k) {
    this.kernel = k;
    this.transitions = new Map();
    this.closed = new Map();
    this.descriptions = [];
  }

  isEqual(state) {
    if (this.kernel.length != state.kernel.length) {
      return false;
    }

    for (let i in this.kernel) {
      let a = this.kernel[i];
      let b = state.kernel[i];
      if (a[0] != b[0] || a[1] != b[1]) {
        return false;
      }
      if (!(a[2].size === b[2].size && [...a[2]].every((x) => b[2].has(x)))) {
        return false;
      }
    }
    return true;
  }

  kernelEqual(state) {
    if (this.kernel.length != state.kernel.length) {
      return false;
    }

    for (let i in this.kernel) {
      let a = this.kernel[i];
      let b = state.kernel[i];
      if (a[0] != b[0] || a[1] != b[1]) {
        return false;
      }
    }
    return true;
  }

  stringify(n) {
    let s = "";
    s += n + "\n";

    for (let i in this.kernel) {
      let first = this.kernel[i][0];
      let second = this.kernel[i][1];
      let third = this.kernel[i][2];

      s += grammar.stringRule(first, second);
      s += " , {" + stringSet(third) + "}\n";
    }
    s += "-----------\n";

    for (let i of this.closed) {
      s += grammar.stringRule(i[0], 1);
      s += " , {" + stringSet(i[1]) + "}\n";
    }

    return s;
  }

  makeTransitions() {
    let transitions = new Map();

    for (let i in this.kernel) {
      let first = this.kernel[i][0];
      let second = this.kernel[i][1];
      let third = this.kernel[i][2];

      if (
        second < grammar.rules[first].length &&
        grammar.nonTerminals.has(grammar.rules[first][second])
      ) {
        for (let j in grammar.rules) {
          if (grammar.rules[j][0] == grammar.rules[first][second]) {
            this.closed.set(j, grammar.FIRST(first, second + 1, third));
            this.descriptions.push(
              grammar.stringRule(j, 1) +
                " closed from " +
                grammar.stringRule(first, second),
            );
            this.descriptions.push(
              "Lookaheads for " +
                grammar.stringRule(j, 1) +
                " computed from FIRST(" +
                grammar.stringSubsetRule(
                  first,
                  second + 1,
                  grammar.rules[first].length,
                ) +
                "{" +
                stringSet(third) +
                "}) from " +
                grammar.stringRule(first, second),
            );
          }
        }
      }
      if (second < grammar.rules[first].length) {
        if (!transitions.has(grammar.rules[first][second])) {
          transitions.set(grammar.rules[first][second], [
            [first, second + 1, third],
          ]);
        } else {
          transitions
            .get(grammar.rules[first][second])
            .push([first, second + 1, third]);
        }
      }
    }

    let closedChanged = true;
    while (closedChanged) {
      closedChanged = false;

      for (let i of this.closed) {
        if (grammar.rules[i[0]].length == 1) {
          continue;
        }
        let first = grammar.rules[i[0]][1];

        if (grammar.nonTerminals.has(first)) {
          for (let r in grammar.rules) {
            if (grammar.rules[r][0] == first) {
              if (!this.closed.has(r)) {
                this.closed.set(r, new Set());
                closedChanged = true;
                let tDesc =
                  grammar.stringRule(r, 1) +
                  " closed from " +
                  grammar.stringRule(i[0], 1);
                if (this.descriptions.indexOf(tDesc) == -1) {
                  this.descriptions.push(tDesc);
                }
              }
              let looks = grammar.FIRST(i[0], 2, i[1]);
              for (let j of looks) {
                if (!this.closed.get(r).has(j)) {
                  closedChanged = true;
                  let tDesc =
                    "Lookaheads for " +
                    grammar.stringRule(r, 1) +
                    " computed from FIRST(" +
                    grammar.stringSubsetRule(
                      i[0],
                      2,
                      grammar.rules[i[0]].length,
                    ) +
                    "{" +
                    stringSet(this.closed.get(i[0])) +
                    "}) from " +
                    grammar.stringRule(i[0], 1);
                  if (this.descriptions.indexOf(tDesc) == -1) {
                    this.descriptions.push(tDesc);
                  }
                }
                this.closed.get(r).add(j);
              }
            }
          }
        }
      }
    }

    for (let i of this.closed) {
      if (1 < grammar.rules[i[0]].length) {
        if (transitions.has(grammar.rules[i[0]][1])) {
          transitions.get(grammar.rules[i[0]][1]).push([i[0], 2, i[1]]);
        } else {
          transitions.set(grammar.rules[i[0]][1], [[i[0], 2, i[1]]]);
        }
      }
    }

    for (let i of transitions) {
      i[1].sort((a, b) => {
        if (a[0] != b[0]) {
          if (a[0] < b[0]) {
            return -1;
          } else {
            return 1;
          }
        } else {
          if (a[1] < b[1]) {
            return -1;
          } else if (a[1] > b[1]) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    }
    return transitions;
  }
}

function stringSet(set) {
  let s = "";
  let first = true;
  for (let i of set) {
    if (first) {
      first = false;
      s += i;
    } else {
      s += ", " + i;
    }
  }
  return s;
}

class StateMachine {
  constructor() {
    this.states = [];
    this.makeState([[0, 1, new Set(["$"])]]);
  }

  makeState(k) {
    let state = new State(k);

    for (let i in this.states) {
      if (this.states[i].isEqual(state)) {
        console.log("State Equal to state " + i);
        return i;
      }
    }

    let pos = this.states.length;
    this.states.push(state);

    let transitions = state.makeTransitions();

    for (let i of transitions) {
      state.transitions.set(i[0], this.makeState(i[1]));
    }

    console.log("Made state " + pos);
    return pos;
  }

  formatStates() {
    let l = [];

    let tr = [];

    for (let s in this.states) {
      l.push([s, this.states[s].stringify(s)]);
      for (let t of this.states[s].transitions) {
        tr.push([s, t[0], t[1]]);
      }
    }

    return [l, tr];
  }

  mergeStates() {
    let a = this.states.length;
    let mappings = {};
    for (let i in this.states) {
      if (this.states[i] == null) {
        continue;
      }
      this.states[i].descriptions = [];
      for (let j = +i + 1; j < this.states.length; j++) {
        if (this.states[j] == null) {
          continue;
        }
        if (this.states[i].kernelEqual(this.states[j])) {
          this.states[i].descriptions.push(
            "LR states " + i + " and " + j + " merged.",
          );
          for (let k in this.states[i].kernel) {
            this.states[i].kernel[k][2] = new Set([
              ...this.states[i].kernel[k][2],
              ...this.states[j].kernel[k][2],
            ]);
          }
          for (let c of this.states[i].closed) {
            this.states[i].closed.set(
              c[0],
              new Set([...c[1], ...this.states[j].closed.get(c[0])]),
            );
          }
          this.states[j] = null;
          mappings[j] = i;
        }
      }
    }
    let off = 0;
    for (let i in this.states) {
      if (this.states[i] == null) {
        off += 1;
        continue;
      }
      mappings[i] = +i - off;
    }
    let newStates = [];
    for (let i in this.states) {
      if (this.states[i] != null) {
        for (let j of this.states[i].transitions) {
          if (typeof mappings[j[1]] == "string") {
            this.states[i].transitions.set(j[0], mappings[mappings[j[1]]]);
          } else {
            this.states[i].transitions.set(j[0], mappings[j[1]]);
          }
        }
        newStates.push(this.states[i]);
      }
    }
    this.states = newStates;
    let b = this.states.length;
    document.getElementById("LALRparseTable").innerHTML =
      "LALR Parse Table (" + Math.floor((1 - b / a) * 100) + "% fewer states)";
  }
}

function makeFIRST() {
  if (grammarError) {
    return;
  }
  for (let terminal of grammar.terminals) {
    grammar._FIRST.set(terminal, new Set([terminal]));
  }
  for (let nonTerminal of grammar.nonTerminals) {
    grammar._FIRST.set(nonTerminal, new Set());
  }

  let FIRSTchanged = true;

  while (FIRSTchanged) {
    FIRSTchanged = false;

    for (let i in grammar.rules) {
      let cont = true;
      let rhs = new Set();
      if (grammar.rules[i].length == 1) {
        rhs.add("%");
      }
      for (let j = 1; j < grammar.rules[i].length && cont; j++) {
        let B = grammar.rules[i][j];
        const t = grammar._FIRST.get(B).values();
        for (let val of t) {
          if (val != "%" || j == grammar.rules[i].length - 1) {
            rhs.add(val);
          }
        }
        if (!grammar._FIRST.get(B).has("%")) {
          cont = false;
        }
      }
      for (let val of rhs) {
        if (!grammar._FIRST.get(grammar.rules[i][0]).has(val)) {
          FIRSTchanged = true;
        }
        grammar._FIRST.get(grammar.rules[i][0]).add(val);
      }
      rhs.clear();
    }
  }
  console.log("Made FIRST");
}

function makeTable(type, tableError, table, sm) {
  tableError[0] = false;
  table[0] = [[["-", 0]]];

  for (let t of grammar.IDS) {
    table[0][0].push(["N", t[0]]);
  }

  for (let s in sm[0].states) {
    table[0].push([["N", s]]);
    for (let t of grammar.IDS) {
      table[0][table[0].length - 1].push(["-", 0]);
    }
  }

  table[0][sm[0].states[0].transitions.get(grammar.start) + 1][
    grammar.IDS.get("$") + 1
  ][0] = "A";
  table[0][sm[0].states[0].transitions.get(grammar.start) + 1][
    grammar.IDS.get("$") + 1
  ][1] = 0;

  for (let i in sm[0].states) {
    for (let j of sm[0].states[i].transitions) {
      if (grammar.nonTerminals.has(j[0])) {
        table[0][+i + 1][grammar.IDS.get(j[0]) + 1][0] = "G";
        table[0][+i + 1][grammar.IDS.get(j[0]) + 1][1] = j[1];
      } else {
        table[0][+i + 1][grammar.IDS.get(j[0]) + 1][0] = "S";
        table[0][+i + 1][grammar.IDS.get(j[0]) + 1][1] = j[1];
      }
    }
    for (let j of sm[0].states[i].closed) {
      if (grammar.rules[j[0]].length == 1) {
        for (let x of j[1]) {
          if (table[0][+i + 1][grammar.IDS.get(x) + 1][0][0] == "S") {
            alert(
              "SHIFT/REDUCE CONFLICT in state " +
                i +
                " on " +
                x +
                " while attempting to reduce rule " +
                j[0],
            );
            table[0][+i + 1][grammar.IDS.get(x) + 1][0] += ",R";
            table[0][+i + 1][grammar.IDS.get(x) + 1][1] += "," + j[0];
            tableError[0] = true;
          } else if (table[0][+i + 1][grammar.IDS.get(x) + 1][0][0] == "R") {
            alert(
              "REDUCE/REDUCE CONFLICT in state " +
                i +
                " on " +
                x +
                " while attempting to reduce rule " +
                j[0],
            );
            table[0][+i + 1][grammar.IDS.get(x) + 1][0] += ",R";
            table[0][+i + 1][grammar.IDS.get(x) + 1][1] += "," + j[0];
            tableError[0] = true;
          } else if (table[0][+i + 1][grammar.IDS.get(x) + 1][0] == "A") {
            continue;
          } else {
            table[0][+i + 1][grammar.IDS.get(x) + 1][0] = "R";
            table[0][+i + 1][grammar.IDS.get(x) + 1][1] = j[0];
          }
        }
      }
    }
    for (let j in sm[0].states[i].kernel) {
      let k = sm[0].states[i].kernel[j];
      if (grammar.rules[k[0]].length == k[1]) {
        for (let x of k[2]) {
          if (table[0][+i + 1][grammar.IDS.get(x) + 1][0][0] == "S") {
            alert(
              "SHIFT/REDUCE CONFLICT in state " +
                i +
                " on " +
                x +
                " while attempting to reduce rule " +
                k[0],
            );
            table[0][+i + 1][grammar.IDS.get(x) + 1][0] += ",R";
            table[0][+i + 1][grammar.IDS.get(x) + 1][1] += "," + k[0];
            tableError[0] = true;
          } else if (table[0][+i + 1][grammar.IDS.get(x) + 1][0][0] == "R") {
            alert(
              "REDUCE/REDUCE CONFLICT in state " +
                i +
                " on " +
                x +
                " while attempting to reduce rule " +
                k[0],
            );
            table[0][+i + 1][grammar.IDS.get(x) + 1][0] += ",R";
            table[0][+i + 1][grammar.IDS.get(x) + 1][1] += "," + k[0];
            tableError[0] = true;
          } else if (table[0][+i + 1][grammar.IDS.get(x) + 1][0] == "A") {
            continue;
          } else {
            table[0][+i + 1][grammar.IDS.get(x) + 1][0] = "R";
            table[0][+i + 1][grammar.IDS.get(x) + 1][1] = k[0];
          }
        }
      }
    }
  }

  let s = "<table>";
  for (let i in table[0]) {
    s += "<tr>";
    for (let j in table[0][i]) {
      if (i == 0 && j == 0) {
        let t = '"' + type + '"';
        s +=
          "<td onclick='collapseTable(" +
          t +
          ", " +
          type +
          "collapsed)' style='cursor:pointer'>v</td>";
      } else if (table[0][i][j][0] == "N") {
        s += "<th>" + table[0][i][j][1] + "</th>";
      } else if (table[0][i][j][0].length > 1) {
        s += "<td class='terr'>";
        let r = table[0][i][j][0].split(/,/);
        let n = table[0][i][j][1].split(/,/);
        for (let i in r) {
          s += r[i] + n[i];
        }
        s += "</td>";
      } else if (table[0][i][j][0] == "G") {
        s += "<td>" + table[0][i][j][1] + "</td>";
      } else if (table[0][i][j][0] == "-") {
        s += "<td></td>";
      } else if (table[0][i][j][0] == "A") {
        s += "<td>Accept</td>";
      } else {
        s += "<td>" + table[0][i][j][0] + table[0][i][j][1] + "</td>";
      }
    }
    s += "</tr>";
  }
  document.getElementById(type + "tableContainer").innerHTML = s;
}

function collapseTable(type, collapsed) {
  collapsed[0] = !collapsed[0];
  let trs = document.getElementById(type + "tableContainer").childNodes[0]
    .childNodes[0].childNodes;
  for (let i in trs) {
    let inside = trs[i].childNodes;
    for (let j in inside) {
      if (i == 0 && j == 0) {
        if (collapsed[0]) {
          inside[j].innerHTML = ">";
        } else {
          inside[j].innerHTML = "v";
        }
        continue;
      }
      inside[j].hidden = collapsed[0];
    }
  }
}

function getGrammar() {
  grammarError = false;
  grammar.nonTerminals = new Set();
  grammar.terminals = new Set();
  grammar.rules = [];
  grammar.IDS = new Map();
  grammar._FIRST = new Map();
  grammar.start = "";

  let rules = document.getElementById("grammarInput").value.split(/\n/);
  for (r in rules) {
    let hasEpsilon = false;
    let t = rules[r].split(/\s/);
    t = t.filter(Boolean);
    rules[r] = [];
    for (i in t) {
      if (i == 1) {
        continue;
      }
      if (t[i] == "%") {
        if (i == 0) {
          alert("Error with rule " + r + ", Epsilon cannot be a nonTerminal.");
          grammarError = true;
        }
        hasEpsilon = true;
      } else {
        if (t[i] == "$") {
          alert("Error with rule " + r + ", $ is reserved for EOF.");
          grammarError = true;
        }
        rules[r].push(t[i]);
      }
    }
    if (!hasEpsilon && rules[r].length < 2) {
      alert("Error with rule " + r + ", rule must have a LHS and RHS.");
      grammarError = true;
    }
    grammar.nonTerminals.add(rules[r][0]);
  }

  grammar.rules = rules;

  grammar.start = grammar.rules[0][0];
  let augStart = grammar.start;

  while (grammar.nonTerminals.has(augStart)) {
    augStart += "'";
  }
  grammar.nonTerminals.add(augStart);
  grammar.rules.unshift([augStart, grammar.start]);

  for (i in grammar.rules) {
    for (j in grammar.rules[i]) {
      if (!grammar.nonTerminals.has(grammar.rules[i][j])) {
        grammar.terminals.add(grammar.rules[i][j]);
      }
    }
  }

  let ID = 0;
  for (i of grammar.nonTerminals) {
    grammar.IDS.set(i, ID++);
  }
  for (i of grammar.terminals) {
    grammar.IDS.set(i, ID++);
  }
  grammar.IDS.set("$", ID);

  console.log("Got Grammar");

  makeFIRST();

  let firstTable = [["Tokens", "FIRST"]];

  for (let f of grammar._FIRST) {
    firstTable.push([f[0], stringSet(f[1])]);
  }
  console.log(firstTable);

  let s = "<table><tr><th>";
  s += firstTable[0][0] + "</th><th>" + firstTable[0][1] + "</th></tr>";
  for (let i = 1; i < firstTable.length; i++) {
    s += "<tr>";
    for (let j in firstTable[i]) {
      s += "<td>" + firstTable[i][j] + "</td>";
    }
    s += "</tr>";
  }
  document.querySelector(".FIRSTContainer").innerHTML = s;
}

function createStateMachine(type, sm, g, inner, render, tableError, table) {
  if (grammarError) {
    alert("Cannot create an automaton with errors in the grammar");
    return;
  }
  if (grammar.rules.length == 0) {
    alert(
      "Cannot create an automaton without a grammar, input grammar with the Input Grammar button",
    );
    return;
  }

  sm[0] = new StateMachine();

  if (type == "LALR") {
    sm[0].mergeStates();
  }

  g[0] = new dagreD3.graphlib.Graph().setGraph({});

  let s = sm[0].formatStates();

  for (let i in s[0]) {
    g[0].setNode(s[0][i][0], { label: s[0][i][1] });
  }

  for (let i in s[1]) {
    g[0].setEdge(s[1][i][0], s[1][i][2], { label: s[1][i][1] });
  }

  g[0].nodes().forEach(function (v) {
    let node = g[0].node(v);
    node.rx = node.ry = 5;
  });

  let svg = d3.select("#" + type + "svgSM");
  inner[0] = svg.select("g");

  let zoom = d3.zoom().on("zoom", function () {
    inner[0].attr("transform", d3.event.transform);
  });
  svg.call(zoom);

  render[0] = new dagreD3.render();

  let styleTooltip = function (name, descriptions) {
    let s = "<p class='tooltipTitle'>" + name + "</p><p class='tooltipDesc'>";
    for (let desc of descriptions) {
      s += desc + "<br>";
    }
    s += "</p>";
    return s;
  };

  render[0](inner[0], g[0]);

  inner[0]
    .selectAll("g.node")
    .attr("title", function (v) {
      return styleTooltip(v, sm[0].states[v].descriptions);
    })
    .each(function (v) {
      $(this).tipsy({
        gravity: "w",
        opacity: 1,
        html: true,
        position: "top-right",
      });
    });

  // Center the graph
  let initialScale = 0.8;
  svg.call(
    zoom.transform,
    d3.zoomIdentity
      .translate(
        (document.querySelector("#" + type + "svgSM").clientWidth -
          g[0].graph().width * initialScale) /
          2,
        20,
      )
      .scale(initialScale),
  );

  // svg.attr('height', g.graph().height * initialScale + 40);

  makeTable(type, tableError, table, sm);
}

function setParse(
  type,
  tableError,
  sm,
  parseError,
  q,
  stack,
  g,
  inner,
  render,
) {
  if (tableError[0]) {
    alert("Cannot parse with errors in parsing table");
    parseError = true;
    return;
  }
  if (grammarError) {
    alert("Cannot parse with errors in grammar");
    parseError = true;
    return;
  }
  if (sm[0] == null) {
    alert(
      "Cannot parse without an automaton make one with the Build State Machine button",
    );
    parseError = true;
    return;
  }
  if (grammar.rules.length == 0) {
    alert(
      "Cannot parse without a grammar, input grammar with the Input Grammar button",
    );
    parseError = true;
    return;
  }

  parseError[0] = false;

  q[0] = new Queue();
  let input = document.getElementById(type + "parseInput").value.split(/\s+/);
  for (v of input) {
    if (v == "") {
      continue;
    }
    q[0].enqueue(v);
  }
  q[0].enqueue("$");
  stack[0] = ["$", "0"];
  setBoxSizes(type, stack[0].join(" "), q[0].join(), "", 8.6);
  for (let i in sm[0].states) {
    g[0].node(i).style = "fill: #666666";
  }
  g[0].node(0).style = "fill: #22ff9d";
  render[0](inner[0], g[0]);
}

function colorStates(stack, g, inner, render) {
  let s = new Set();
  for (let i in stack[0]) {
    if (+stack[0][i] || stack[0][i] == 0) {
      s.add(+stack[0][i]);
    }
  }

  for (let i of s) {
    if (s.has(+i)) {
      g[0].node(i).style = "fill: #22ff9d";
    }
  }
  render[0](inner[0], g[0]);
}

function parseNext(type, stack, g, inner, parseError, q, render, table, sm) {
  if (parseError[0]) {
    alert("Cannot parse next, reset parse");
    return;
  }
  if (q[0].empty()) {
    alert("Parsing finished");
    return;
  }

  let state = stack[0][stack[0].length - 1];
  if (!grammar.terminals.has(q[0].peek()) && q[0].peek() != "$") {
    alert("Token '" + q[0].peek() + "' not in grammar");
    parseError[0] = true;
    return;
  }

  let t = table[0][+state + 1][grammar.IDS.get(q[0].peek()) + 1];
  if (t[0] == "R") {
    if (grammar.rules[t[1]].length != 1) {
      let p = grammar.rules[t[1]].length - 1;
      while (p > 0) {
        if (stack[0][stack[0].length - 1] == grammar.rules[t[1]][p]) {
          p--;
        } else {
          g[0].node(stack[0][stack[0].length - 1]).style = "fill: #666666";
        }
        stack[0].pop();
      }
    }

    state = stack[0][stack[0].length - 1];

    stack[0].push(grammar.rules[t[1]][0]);

    stack[0].push(
      table[0][+state + 1][
        grammar.IDS.get(stack[0][stack[0].length - 1]) + 1
      ][1],
    );

    colorStates(stack, g, inner, render);

    setBoxSizes(
      type,
      stack[0].join(" "),
      q[0].join(),
      "Reduce " + t[1] + ", Goto " + stack[0][stack[0].length - 1],
      8.6,
    );
  } else if (t[0] == "S") {
    stack[0].push(q[0].peek());

    stack[0].push(t[1]);

    q[0].dequeue();

    colorStates(stack, g, inner, render);

    setBoxSizes(type, stack[0].join(" "), q[0].join(), "Shift " + t[1], 8.6);
  } else if (t[0] == "A") {
    setBoxSizes(type, "", "", "ACCEPT", 8.6);
    while (!q[0].empty()) {
      q[0].dequeue();
    }
    return;
  } else {
    let m = "SYNTAX ERROR in state " + state + " expecting ";
    g[0].node(state).style = "fill: #F75050";
    render[0](inner[0], g[0]);
    let exp = new Set();

    for (let i in sm[0].states[state].kernel) {
      if (
        grammar.rules[sm[0].states[state].kernel[i][0]].length ==
        sm[0].states[state].kernel[i][1]
      ) {
        for (let j of sm[0].states[state].kernel[i][2]) {
          exp.add(j);
        }
      }
    }
    for (let i of sm[0].states[state].closed) {
      if (grammar.rules[i[0]].length == 1) {
        for (let j of i[1]) {
          exp.add(j);
        }
      }
    }
    for (let i of sm[0].states[state].transitions) {
      if (grammar.terminals.has(i[0])) {
        exp.add(i[0]);
      }
    }

    let f = true;
    for (let p of exp) {
      if (f) {
        m += p;
        f = false;
      } else {
        m += " or " + p;
      }
    }
    m += ", not " + q[0].peek() + ".";
    alert(m);
    parseError = true;
  }
}

function setBoxSizes(type, a, b, c, factor) {
  let t = document.getElementById(type + "stack");
  t.value = a;
  t.style.width = (t.value.length + 1) * factor + "px";
  t = document.getElementById(type + "reinput");
  t.value = b;
  t.style.width = (t.value.length + 1) * factor + "px";
  t = document.getElementById(type + "action");
  t.value = c;
  t.style.width = (t.value.length + 1) * factor + "px";
}

