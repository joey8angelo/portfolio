let terminals;
let nonterminals;
let productions;
let table;
let idNonterm;
let idTerm;
let FIRST;
let FOLLOW;
let isLL1;
let stack;
let q;

// Tree variables
let scaleValue = 1.0;
let treeData;
let treeStack;

let width = document.getElementById("container").clientWidth - 3;
height = document.getElementById("container").clientHeight;

let sid = 0;

let tree = d3.layout.tree().size([height, width]);

let diagonal = d3.svg.diagonal().projection(function (d) {
  return [d.x, d.y];
});

let svg = d3
  .select("div#container")
  .append("svg")
  .attr("id", "svgElement")
  .attr("width", width)
  .attr("height", height)
  .attr("style", "border:1px solid gray")
  .attr("viewBox", "0 0 " + width + " " + height)
  .attr("classed", "svg-content")
  .append("g")
  .attr("transform", "translate(400,100)")
  .attr("id", "gElement");

d3.select(self.frameElement).style("height", "width");
//end tree variables

function getGrammar() {
  isLL1 = true;
  productions = new Array();
  terminals = new Set();
  nonterminals = new Set();
  productions = document.getElementById("grammarIn").value.split(/\n/);
  for (i in productions) {
    productions[i] = productions[i].split(/\s/);
    productions[i] = [productions[i][0]].concat(productions[i].slice(2));
    nonterminals.add(productions[i][0]);
  }
  for (i in productions) {
    for (j in productions[i]) {
      if (!nonterminals.has(productions[i][j])) {
        terminals.add(productions[i][j]);
      }
    }
  }
  console.log("Made productions", productions);
  makeFIRST();
  makeFOLLOW();
  makeTable();
}

function makeFIRST() {
  FIRST = new Map();
  for (let terminal of terminals) {
    FIRST.set(terminal, new Set([terminal]));
  }
  for (let nonterminal of nonterminals) {
    FIRST.set(nonterminal, new Set());
  }

  let FIRSTchanged = true;

  while (FIRSTchanged) {
    FIRSTchanged = false;

    for (i in productions) {
      let cont = true;
      let rhs = new Set();
      for (let j = 1; j < productions[i].length && cont; j++) {
        let B = productions[i][j];
        const t = FIRST.get(B).values();
        for (let val of t) {
          if (val != "%" || j == productions[i].length - 1) {
            rhs.add(val);
          }
        }
        if (!FIRST.get(B).has("%")) {
          cont = false;
        }
      }
      for (let val of rhs) {
        if (!FIRST.get(productions[i][0]).has(val)) {
          FIRSTchanged = true;
        }
        FIRST.get(productions[i][0]).add(val);
      }
      rhs.clear();
    }
  }
  console.log("Made FIRST", FIRST);
}

function makeFOLLOW() {
  FOLLOW = new Map();
  for (let A of nonterminals) {
    FOLLOW.set(A, new Set());
  }
  FOLLOW.get("S").add("$");

  let FOLLOWchanged = true;

  while (FOLLOWchanged) {
    FOLLOWchanged = false;

    for (i in productions) {
      let trailer = new Set();
      for (t of FOLLOW.get(productions[i][0])) {
        trailer.add(t);
      }
      for (t of FOLLOW.get(productions[i][0])) {
        trailer.add(t);
      }
      for (let j = productions[i].length - 1; j >= 1; j--) {
        let B = productions[i][j];
        if (nonterminals.has(B)) {
          for (let trail of trailer) {
            if (!FOLLOW.get(B).has(trail)) {
              FOLLOWchanged = true;
            }
            FOLLOW.get(B).add(trail);
          }
          if (FIRST.get(B).has("%")) {
            for (let t of FIRST.get(B)) {
              if (t != "%") {
                trailer.add(t);
              }
            }
          } else {
            trailer = new Set();
            for (t of FIRST.get(B)) {
              trailer.add(t);
            }
          }
        } else {
          trailer = new Set();
          for (t of FIRST.get(B)) {
            trailer.add(t);
          }
        }
      }
    }
  }
  console.log("Made Follow", FOLLOW);
}

function makeTable() {
  table = new Array();
  idNonterm = new Map();
  idTerm = new Map();
  terminals.delete("%");
  terminals.add("$");

  let id = 1;
  table.push(new Array(""));

  for (let nonterm of nonterminals) {
    idNonterm.set(nonterm, id++);
    table.push(new Array(nonterm));
  }

  id = 1;

  for (let term of terminals) {
    idTerm.set(term, id++);
    table[0].push(term);
  }

  for (let i = 1; i < nonterminals.size + 1; i++) {
    for (let j = 0; j < terminals.size; j++) {
      table[i].push("");
    }
  }

  let rule;

  for (i in productions) {
    rule = "";
    let cont = true;
    let curr = new Set();

    for (let j = 1; j < productions[i].length; j++) {
      let B = productions[i][j];
      if (j == 1) {
        rule = B;
      } else {
        rule += " " + B;
      }

      if (cont) {
        for (let f of FIRST.get(B)) {
          if (f != "%" || j == productions[i].length - 1) {
            curr.add(f);
          }
        }
      }
      if (!FIRST.get(B).has("%")) {
        cont = false;
      }
    }

    if (curr.has("%")) {
      curr.delete("%");
      for (let f of FOLLOW.get(productions[i][0])) {
        curr.add(f);
      }
    }

    let A = productions[i][0];
    for (let a of curr) {
      if (table[idNonterm.get(A)][idTerm.get(a)] != "") {
        console.log("CONFLICTS IN TABLE");
        table[idNonterm.get(A)][idTerm.get(a)] += "<br>";
        isLL1 = false;
      }
      table[idNonterm.get(A)][idTerm.get(a)] += rule;
    }
  }
  if (!isLL1) {
    alert("Table has conflicts, Grammar is not LL1");
  }
  console.log("Made Table", table);
  displayTable();
}

function displayTable() {
  document.getElementById("table1body").innerHTML = "";
  let content = "";
  for (nonterminal of nonterminals) {
    content = "<tr>";
    content += "<td>" + nonterminal + "</td>";
    content += "<td>";
    let vals = [];
    for (val of FIRST.get(nonterminal)) {
      vals.push(val);
    }
    content += vals.join(", ") + "</td>";
    content += "<td>";
    vals = [];
    for (val of FOLLOW.get(nonterminal)) {
      vals.push(val);
    }
    content += vals.join(", ") + "</td";
    document.getElementById("table1body").innerHTML += content;
  }

  document.getElementById("table2head").innerHTML = "";
  document.getElementById("table2body").innerHTML = "";

  content = "";
  for (j in table[0]) {
    if (table[0][j].search(/<br>/) != -1) {
      content +=
        "<th class='err'>" + (table[0][j] == "" ? "-" : table[0][j]) + "</th>";
    } else {
      content += "<th>" + (table[0][j] == "" ? "-" : table[0][j]) + "</th>";
    }
  }
  document.getElementById("table2head").innerHTML = content;
  content = "";
  for (let i = 1; i < table.length; i++) {
    content += "<tr>";
    for (j in table[0]) {
      if (table[i][j].search(/<br>/) != -1) {
        content +=
          "<td class='err'>" +
          (table[i][j] == "" ? "-" : table[i][j]) +
          "</td>";
      } else {
        content += "<td>" + (table[i][j] == "" ? "-" : table[i][j]) + "</td>";
      }
    }
    content += "</tr>";
  }
  document.getElementById("table2body").innerHTML = content;
}

function parseNext() {
  if (!isLL1) {
    alert("Cannot parse non LL1 grammar");
    return;
  }
  if (q.empty() || stack.length == 0) {
    alert("Parsing finished");
    return;
  }
  if (stack[stack.length - 1] == q.peek()) {
    stack.pop();
    q.dequeue();

    setBoxSizes(stack.join(" "), q.join(), "MATCH", 8.6);
  } else {
    if (!nonterminals.has(q.peek()) && !terminals.has(q.peek())) {
      alert("Input '" + q.peek() + "' is not a token in the grammar");
    }
    if (!isLL1) {
      alert("error");
      return;
    }
    let lhs = stack[stack.length - 1];
    if (!nonterminals.has(lhs)) {
      alert("Syntax Error, expecting: " + lhs);
      return;
    }
    let t = table[idNonterm.get(lhs)][idTerm.get(q.peek())];

    if (t == "") {
      let expect = getExpectedValues(lhs);
      alert("Syntax Error, expecting: " + expect);
      return;
    }

    stack.pop();
    let rule = t.split(" ");
    for (let i = rule.length - 1; i >= 0; i--) {
      if (rule[i] == "%") {
        continue;
      }
      stack.push(rule[i]);
    }

    setBoxSizes(stack.join(" "), q.join(), lhs + " > " + rule.join(" "), 8.6);

    let nodeToUpdate = treeStack.pop();

    let children = [];
    for (let rul of rule) {
      children.push({ name: rul, children: [] });
    }

    nodeToUpdate.children = children;

    for (let i = children.length - 1; i >= 0; i--) {
      if (nonterminals.has(children[i].name)) {
        treeStack.push(children[i]);
      }
    }
    update(nodeToUpdate);
  }
}

function getExpectedValues(lhs) {
  let expect = [];
  for (v of FIRST.get(lhs)) {
    if (v == "%") {
      for (va of FOLLOW.get(lhs)) {
        expect.push(va);
      }
    } else {
      expect.push(v);
    }
  }
  return expect.join(", ");
}

function setBoxSizes(a, b, c, factor) {
  let t = document.getElementById("stack");
  t.value = a;
  t.style.width = (t.value.length + 1) * factor + "px";
  t = document.getElementById("reinput");
  t.value = b;
  t.style.width = (t.value.length + 1) * factor + "px";
  t = document.getElementById("rule");
  t.value = c;
  t.style.width = (t.value.length + 1) * factor + "px";
}

function setParse() {
  q = new Queue();
  let input = document.getElementById("inputIn").value.split(/\s+/);
  for (v of input) {
    if (v == "") {
      continue;
    }
    q.enqueue(v);
  }
  q.enqueue("$");
  stack = ["$", "S"];
  setBoxSizes(stack.join(" "), q.join(), "", 8.6);
  treeData = { name: "S", children: [] };
  treeStack = [treeData];
  treeData.x0 = width / 2;
  treeData.y0 = 0;
  update(treeData);
}

//functions for Tree

function update(source) {
  let nodes = tree.nodes(treeData).reverse(),
    links = tree.links(nodes);

  nodes.forEach(function (d) {
    d.y = d.depth * 70;
  });

  let node = svg.selectAll("g.node").data(nodes, function (d) {
    return d.id || (d.id = ++sid);
  });

  let nodeEnter = node
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + source.x0 + "," + source.y0 + ")";
    })
    .on("click", click);

  nodeEnter
    .append("text")
    .attr("x", function (d) {
      return d.children || d._children ? -13 : 13;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function (d) {
      return d.children || d._children ? "end" : "start";
    })
    .text(function (d) {
      return d.name;
    })
    .style("fill-opacity", 1e-6)
    .style("fill", function (d) {
      return d._children ? "red" : "white";
    });

  let nodeUpdate = node
    .transition()
    .duration(750)
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  nodeUpdate
    .select("text")
    .style("fill-opacity", 1)
    .style("fill", function (d) {
      return d._children ? "red" : "white";
    });

  let nodeExit = node
    .exit()
    .transition()
    .duration(750)
    .attr("transform", function (d) {
      return "translate(" + source.x + "," + source.y + ")";
    })
    .remove();

  nodeExit.select("text").style("fill-opacity", 1e-6);

  let link = svg.selectAll("path.link").data(links, function (d) {
    return d.target.id;
  });

  link
    .enter()
    .insert("path", "g")
    .attr("class", "link")
    .attr("d", function (d) {
      let o = { x: source.x0, y: source.y0 };
      return diagonal({ source: o, target: o });
    });

  link.transition().duration(750).attr("d", diagonal);

  link
    .exit()
    .transition()
    .duration(750)
    .attr("d", function (d) {
      let o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  nodes.forEach(function (d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function extendDownwards() {
  let d = document.getElementById("container");
  let dh = d.clientHeight;

  let g = document.getElementById("gElement");
  let gh =
    g.getBBox().height + 40 > dh + 100 ? g.getBBox().height + 40 : dh + 100;

  let svgE = document.querySelector("#container svg");
  svgE.setAttributeNS(null, "height", gh);
}

function moveUp() {
  let g = document.getElementById("gElement");
  let att = g.getAttributeNS(null, "transform");
  let v = att.split(",");
  let v1 = Number(v[0].split("(")[1]);
  let v2 = Number(v[1].substring(0, v[1].length - 1));

  g.setAttributeNS(
    null,
    "transform",
    "translate(" + String(v1) + "," + String(v2 - 20) + ")",
  );
}
function moveLeft() {
  let g = document.getElementById("gElement");
  let att = g.getAttributeNS(null, "transform");
  let v = att.split(",");
  let v1 = Number(v[0].split("(")[1]);
  let v2 = Number(v[1].substring(0, v[1].length - 1));

  g.setAttributeNS(
    null,
    "transform",
    "translate(" + String(v1 - 20) + "," + String(v2) + ")",
  );
}
function moveRight() {
  let g = document.getElementById("gElement");
  let att = g.getAttributeNS(null, "transform");
  let v = att.split(",");
  let v1 = Number(v[0].split("(")[1]);
  let v2 = Number(v[1].substring(0, v[1].length - 1));

  g.setAttributeNS(
    null,
    "transform",
    "translate(" + String(v1 + 20) + "," + String(v2) + ")",
  );
}
function moveDown() {
  let g = document.getElementById("gElement");
  let att = g.getAttributeNS(null, "transform");
  let v = att.split(",");
  let v1 = Number(v[0].split("(")[1]);
  let v2 = Number(v[1].substring(0, v[1].length - 1));

  g.setAttributeNS(
    null,
    "transform",
    "translate(" + String(v1) + "," + String(v2 + 20) + ")",
  );
}
