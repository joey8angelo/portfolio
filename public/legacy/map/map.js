//code for linked_list style unordered_map

function defaultHash(v) {
  let h = 0,
    i,
    chr;
  if (v.length === 0) return h;
  for (i = 0; i < v.length; i++) {
    chr = v.charCodeAt(i);
    h = (h << 5) - h + chr;
    h |= 0;
  }
  return Math.abs(h);
}

class Q_unordered_map {
  constructor() {
    this._arr = [];
    for (let i = 0; i < 15; i++) {
      this._arr.push({ key: null, value: null, visited: 0 });
    }
    this._size = 0;
    this._load_factor = 0;
    this._max_load_factor = 0.75;
    this.hasher = defaultHash;
  }

  insert(k, v) {
    let has = this.find(k);
    if (has === -1) {
      return;
    }
    if (has) {
      has.value = v;
      let b = this.findBucket(k);
      document.getElementById("q-unordered-map-container" + b).innerHTML =
        this.bucketContent(this._arr[b], b);
      return;
    }

    this._size += 1;
    this._load_factor = this._size / this._arr.length;
    if (this._load_factor >= this._max_load_factor) {
      this.rehash(this._arr.length * 2);
      this._load_factor = this._size / this._arr.length;
    }
    let hs = this.hasher(k);
    let i = 0;
    while (true) {
      let t = (hs + Math.pow(i, 2)) % this._arr.length;
      if (this._arr[t].key === null) {
        this._arr[t].key = k;
        this._arr[t].value = v;
        this._arr[t].visited = 0;
        this.insertHTML(k, v, t);
        flashAt(
          t,
          document.getElementById("q-unordered-map-container" + t),
          "green",
        );
        console.log("inserted");
        break;
      } else {
        flashAt(
          t,
          document.getElementById("q-unordered-map-container" + t),
          "yellow",
        );
      }
      i++;
    }
    document.getElementById("q-load-factor-view").value =
      Math.round(q_unordered_map._load_factor * 100) + "%";
  }

  insertHTML(k, v, hs) {
    let d = document.getElementById("q-unordered-map-container" + hs);
    d.innerHTML = "<p>" + k + ":" + v + "</p>";
  }

  find(k) {
    let hs = this.hasher(k);
    let i = 0;
    while (true) {
      let t = (hs + Math.pow(i, 2)) % this._arr.length;
      if (this._arr[t].key === null && this._arr[t].visited === 0) {
        return null;
      }
      if (this._arr[t].key === k) {
        return this._arr[t];
      }
      i++;
    }
  }

  findBucket(k) {
    let hs = this.hasher(k);
    let i = 1;
    while (true) {
      let t = (hs + Math.pow(i, 2)) % this._arr.length;
      if (this._arr[t].key === k) {
        return t;
      }
      i++;
    }
  }

  erase(k) {
    let has = this.find(k);
    if (!has) {
      return;
    }
    let bucket = this.findBucket(k);

    has.key = null;
    has.value = null;
    has.visited = 1;
    this._size--;
    let d = document.getElementById("q-unordered-map-container" + bucket);
    d.innerHTML = this.bucketContent(this._arr[bucket]);
    document.getElementById("q-load-factor-view").value =
      Math.round(q_unordered_map._load_factor * 100) + "%";
  }

  remove_all() {
    this._arr = [];
    for (let i = 0; i < 15; i++) {
      this._arr.push({ key: null, value: null, visited: 0 });
    }
    this._size = 0;
    this._load_factor = 0;
    document.getElementById("q-load-factor-view").value =
      Math.round(this._load_factor * 100) + "%";
    this.display();
  }

  rehash(n) {
    let newBuckets = this.nextPrime(n);
    let newArr = [];
    for (let i = 0; i < newBuckets; i++) {
      newArr.push({ key: null, value: null, visited: 0 });
    }
    for (let i = 0; i < this._arr.length; i++) {
      if (this._arr[i].key) {
        let hs = this.hasher(this._arr[i].key);
        let j = 0;
        while (true) {
          let t = (hs + Math.pow(j, 2)) % newBuckets;
          if (newArr[t].key === null) {
            newArr[t].key = this._arr[i].key;
            newArr[t].value = this._arr[i].value;
            newArr[t].visited = 0;
            break;
          }
          j++;
        }
      }
    }
    this._arr = newArr;

    this.display();
    console.log("rehashed q_map");
  }

  display() {
    let d = document.getElementById("q-unordered-map-container");
    let s = "";
    for (let i in this._arr) {
      let t = this.bucketContent(this._arr[i], i);
      s += "<div id='q-unordered-map-container" + i + "'>" + t + "</div>";
    }
    d.innerHTML = s;
  }

  bucketContent(ob, pos) {
    if (ob.key === null && ob.visited === 1) {
      return "X";
    } else if (ob.key != null) {
      return "<p>" + ob.key + ":" + ob.value + "</p>";
    }
    return '<p style="color:gray;">' + pos + "</p>";
  }

  nextPrime(n) {
    if (n % 2 === 0) {
      n++;
    }
    while (!this.isPrime(n)) {
      n += 2;
    }
    return n;
  }

  isPrime(n) {
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }
}

class C_unordered_map {
  constructor() {
    this._arr = [];
    for (let i = 0; i < 15; i++) {
      this._arr.push({ key: null, value: null, next: null });
    }
    this._size = 0;
    this._load_factor = 0;
    this._max_load_factor = 0.75;
    this.hasher = defaultHash;
  }

  insert(k, v) {
    let has = this.find(k);
    if (has) {
      has.value = v;
      let b = this.findBucket(k);
      document.getElementById("c-unordered-map-container" + b).innerHTML =
        this.bucketContent(this._arr[b], b);
      return;
    }
    this._size += 1;
    this._load_factor = this._size / this._arr.length;
    if (this._load_factor >= this._max_load_factor) {
      this.rehash(this._arr.length * 2);
      this._load_factor = this._size / this._arr.length;
    }
    let hs = this.findBucket(k);
    let ins = this._arr[hs];
    while (ins.next != null) {
      ins = ins.next;
    }
    ins.next = { key: k, value: v, next: null };
    this.insertHTML(k, v, hs);
    document.getElementById("c-load-factor-view").value =
      Math.round(this._load_factor * 100) + "%";
    console.log("inserted to c_map");
    flashAt(
      hs,
      document.getElementById("c-unordered-map-container" + hs),
      "green",
    );
  }

  insertHTML(k, v, hs) {
    let d = document.getElementById("c-unordered-map-container" + hs);
    if (
      d.innerHTML ===
      '<p style="color:gray; border-bottom:none;">' + hs + "</p>"
    ) {
      d.innerHTML = "";
    }
    d.innerHTML = d.innerHTML + "<p>" + k + ":" + v + "</p>";
  }

  find(k) {
    let hs = this.findBucket(k);
    let curr = this._arr[hs].next;
    while (curr != null) {
      if (curr.key === k) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }

  find_parent(k) {
    let hs = this.findBucket(k);
    let curr = this._arr[hs];
    while (curr.next != null) {
      if (curr.next.key === k) {
        return curr;
      }
      curr = curr.next;
    }
    return null;
  }

  findBucket(k) {
    return this.hasher(k) % this._arr.length;
  }

  erase(k) {
    let curr = this.find_parent(k);
    let bucket = this.findBucket(k);
    if (curr === null) {
      return;
    }
    curr.next = curr.next.next;
    this._size--;
    this._load_factor = this._size / this._arr.length;

    let d = document.getElementById("c-unordered-map-container" + bucket);
    d.innerHTML = this.bucketContent(this._arr[bucket]);
    document.getElementById("c-load-factor-view").value =
      Math.round(this._load_factor * 100) + "%";
  }

  remove_all() {
    this._arr = [];
    for (let i = 0; i < 15; i++) {
      this._arr.push({ key: null, value: null, next: null });
    }
    this._size = 0;
    this._load_factor = 0;
    document.getElementById("c-load-factor-view").value =
      Math.round(this._load_factor * 100) + "%";
    this.display();
  }

  rehash(n) {
    let newBuckets = this.nextPrime(n);
    let newArr = [];
    for (let i = 0; i < newBuckets; i++) {
      newArr.push({ key: null, value: null, next: null });
    }
    for (let i = 0; i < this._arr.length; i++) {
      let curr = this._arr[i].next;
      while (curr != null) {
        let hs = this.hasher(curr.key) % newBuckets;
        let newCurr = newArr[hs];
        while (newCurr.next != null) {
          newCurr = newCurr.next;
        }
        newCurr.next = { key: curr.key, value: curr.value, next: null };
        curr = curr.next;
      }
    }
    this._arr = newArr;

    this.display();
    console.log("rehashed c_map");
  }

  display() {
    let d = document.getElementById("c-unordered-map-container");
    let s = "";
    for (let i in this._arr) {
      let t = this.bucketContent(this._arr[i], i);
      s += "<div id='c-unordered-map-container" + i + "'>" + t + "</div>";
    }
    d.innerHTML = s;
  }

  bucketContent(ob, pos) {
    let s = "";
    ob = ob.next;
    if (ob === null) {
      s += '<p style="color:gray; border-bottom:none;">' + pos + "</p>";
    }
    while (ob != null) {
      s += "<p>" + ob.key + ":" + ob.value + "</p>";
      ob = ob.next;
    }
    return s;
  }

  nextPrime(n) {
    if (n % 2 === 0) {
      n++;
    }
    while (!this.isPrime(n)) {
      n += 2;
    }
    return n;
  }

  isPrime(n) {
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) {
        return false;
      }
    }
    return true;
  }
}

let c_unordered_map = new C_unordered_map();
let q_unordered_map = new Q_unordered_map();

// code for html

function insertFromHTML() {
  let k = document.getElementById("key-input").value;
  let v = document.getElementById("value-input").value;

  if (!k || !v) {
    alert("Input must have key and value");
    return;
  }

  let sel = document.getElementById("map-selection").selectedIndex;
  if ([0, 2].indexOf(sel) > -1) {
    c_unordered_map.insert(k, v);
  }
  if ([1, 2].indexOf(sel) > -1) {
    q_unordered_map.insert(k, v);
  }
}

function eraseKey() {
  flashBox("red");
  let k = document.getElementById("key-input").value;
  let sel = document.getElementById("map-selection").selectedIndex;
  if ([0, 2].indexOf(sel) > -1) {
    c_unordered_map.erase();
  }
  if ([1, 2].indexOf(sel) > -1) {
    q_unordered_map.erase();
  }
}

function removeAll() {
  let sel = document.getElementById("map-selection").selectedIndex;
  if ([0, 2].indexOf(sel) > -1) {
    c_unordered_map.remove_all();
  }
  if ([1, 2].indexOf(sel) > -1) {
    q_unordered_map.remove_all();
  }
}

function update_load_factor() {
  let v;
  let sel = document.getElementById("map-selection").selectedIndex;
  if ([0, 2].indexOf(sel) > -1) {
    v = document.getElementById("c-set-load-factor").value / 100;
    c_unordered_map._max_load_factor = v;
    console.log("updated c_map load factor to", v);
  }
  if ([1, 2].indexOf(sel) > -1) {
    v = document.getElementById("q-set-load-factor").value / 100;
    q_unordered_map._max_load_factor = v;
    console.log("updated q_map load factor to", v);
  }
}

function setHash() {
  let v;
  let sel = document.getElementById("map-selection").selectedIndex;
  if ([0, 2].indexOf(sel) > -1) {
    v = document.getElementById("c-set-hash").value;
    if (!v) {
      console.log("Use default hash for c-map");
      c_unordered_map.hasher = defaultHash;
    } else {
      eval(v);
      c_unordered_map.hasher = myhash;
      console.log("updated hasher for c-map");
    }
  }
  if ([1, 2].indexOf(sel) > -1) {
    v = document.getElementById("q-set-hash").value;
    if (!v) {
      console.log("Use default hash for q-map");
      q_unordered_map.hasher = defaultHash;
    } else {
      eval(v);
      q_unordered_map.hasher = myhash;
      console.log("updated hasher for q-map");
    }
  }
}

document
  .getElementById("key-input")
  .addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
      insertFromHTML();
    }
  });
document
  .getElementById("value-input")
  .addEventListener("keypress", function onEvent(event) {
    if (event.key === "Enter") {
      insertFromHTML();
    }
  });

function randomString() {
  let k = makestr(Math.floor(Math.random() * 10 + 1));
  let v = makestr(Math.floor(Math.random() * 1 + 1));
  let sel = document.getElementById("map-selection").selectedIndex;
  if ([0, 2].indexOf(sel) > -1) {
    c_unordered_map.insert(k, v);
    document.getElementById("c-load-factor-view").value =
      Math.round(c_unordered_map._load_factor * 100) + "%";
  }
  if ([1, 2].indexOf(sel) > -1) {
    q_unordered_map.insert(k, v);
    document.getElementById("q-load-factor-view").value =
      Math.round(q_unordered_map._load_factor * 100) + "%";
  }
}

function makestr(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function flashBox(color) {
  let key = document.getElementById("key-input").value;
  if (!key) {
    alert("Add a key to search for in the key text box");
    return;
  }
  let sel = document.getElementById("map-selection").selectedIndex;
  if ([0, 2].indexOf(sel) > -1) {
    if (!c_unordered_map.find(key)) {
      alert("Key not in map");
      return;
    }
    flashAt(
      c_unordered_map.findBucket(key),
      document.getElementById(
        "c-unordered-map-container" + c_unordered_map.findBucket(key),
      ),
      color,
    );
  }
  if ([1, 2].indexOf(sel) > -1) {
    if (!q_unordered_map.find(key)) {
      alert("Key not in map");
      return;
    }
    flashAt(
      q_unordered_map.findBucket(key),
      document.getElementById(
        "q-unordered-map-container" + q_unordered_map.findBucket(key),
      ),
      color,
    );
  }
}

function flashAt(bucket, docBucket, color) {
  console.log("flash bucket", bucket, color);
  switch (color) {
    case "green":
      docBucket.classList.add("flashg");
      break;
    case "yellow":
      docBucket.classList.add("flashy");
      break;
    case "red":
      docBucket.classList.add("flashr");
  }
  setTimeout(() => {
    docBucket.classList.remove("flashg", "flashy", "flashr");
  }, 500);
}

injectMenu(
  [{ name: "Source Code", url: "https://github.com/joey8angelo/map" }],
  "Hash Maps, or Hash Tables, are associated containers that are formed with a key value and a mapped value, allowing for fast retrieval of elements based on their key. A hash function computes the index in the array to store the values. Chaining and Quadratic probing are collision resolution techniques. Chaining appends colliding keys to one another. Quadratic probing finds the next open bucket by computing the hash and adding i^2 until an open bucket is found. The success of a Hash Table depends on how well the hash function assigns unique keys to unique buckets.",
);

