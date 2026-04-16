let opts = [];

class input{
    constructor(name, set, options={}){
        this.name = name; // unique name of the option
        this.d = document.getElementById(name); // DOM element
        this.alias = options.alias; // Display name of the option, if null the console does not log updates
        if(options.default===undefined && !this.d){
            throw new Error("Default value must be set if no DOM element is found for " + name);
        }
        this.setDefault(options.default);
        this.set = set; // Function that changes the setting in the main script
        this.restoreContext();
        if(this.d)
            this.d.addEventListener('input', debounce(this, options.debounce ? options.debounce : 0));

    }
    setter(){ //debounce calls setter to set the value and save context of the option
        this.set(this.d.value);
        if(this.alias)
            console.log("set", this.alias, "to", this.d.value);
        this.saveContext(this.d.value);
    }
    reset(){
        this.set(this.default);
        if(this.alias)
            console.log("reset", this.alias, "to", this.default);
        this.saveContext(this.default);
        this.updateDoc(this.default);
    }
    saveContext(v){
        localStorage.setItem(this.name, v);
        if(this.alias)
            console.log("saved", this.alias, "with value", v);
    }
    restoreContext(){ 
        let v = localStorage.getItem(this.name);
        if(v == null){
            v = this.default;
        }
        if(this.alias)
            console.log("restored", this.alias, "with value", v);
        this.set(v); 
        this.updateDoc(v);
    }
    updateDoc(v){ 
        if(this.d)
            this.d.value = v; 
    }
    setDefault(def){
        this.default = def!==undefined ? def : this.d.value;
    }
    type(){ return "input"; }
};

class numeric extends input{
    constructor(name, set, options={}){
        super(name, set, options);
        if(options.min!==undefined)
            this.min = options.min;
        else if(this.d && this.d.min)
            this.min = Number(this.d.min);
        else
            this.min = null;
        
        if(options.max!==undefined)
            this.max = options.max;
        else if(this.d && this.d.max)
            this.max = Number(this.d.max);
        else
            this.max = null;
    }
    setter(){
        let v = Number(this.d.value);
        if(this.min != null && v < this.min){
            v = this.min;
        } else if(this.max != null && v > this.max){
            v = this.max;
        }
        if(this.alias)
            console.log("set", this.alias, "to", v);
        this.set(v);
        localStorage.setItem(this.name, v);
    }
    restoreContext(){
        let v = Number(localStorage.getItem(this.name));
        if(localStorage.getItem(this.name) == null){
            v = this.default;
        }
        if(this.alias)
            console.log("restored", this.alias, "with value", v);
        this.set(v); 
        this.updateDoc(v);
    }
    setDefault(def){
        this.default = def!==undefined ? def : Number(this.d.value);
    }
    type(){ return "numeric"; }
}

class check extends input{
    constructor(name, set, options={}){
        super(name, set, options);
    }
    setter(){
        let v = this.d.checked;
        if(this.alias)
            console.log("set", this.alias, "to", v);
        this.set(v);
        localStorage.setItem(this.name, v);
    }
    restoreContext(){
        let v = localStorage.getItem(this.name) === "true" ? true : false;
        if(localStorage.getItem(this.name) == null){
            v = this.default;
        }
        if(this.alias)
            console.log("restored", this.alias, "with value", v);
        this.set(v); 
        this.updateDoc(v);
    }
    updateDoc(v){
        if(this.d)
            this.d.checked = v;
    }
    setDefault(def){
        this.default = def!==undefined ? def : this.d.checked;
    }
    type(){ return "check"; }
}

// debounce function to prevent spamming the event listener
function debounce(opt, wait) {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(function () { opt.setter(); }, wait);
    };
}

if(document.getElementById("optToggle")){
    document.getElementById("optToggle").addEventListener('click', toggleOptions);
    function toggleOptions(){
        console.log("toggling options");
        for(t of document.querySelectorAll(".option")){
            t.hidden = !t.hidden;
        }
    }
}

/*
    Options allow the user to change settings and keep them persistent across sessions.
    Comes before menu.js and the main script in the HTML file.
    Usage:
        in the HTML file add an input element with an id
        in the script add an option of type input, numeric, or check
            input: new input(id, setFunction, options)
                options for input are:
                    alias: display name
                    default: default value
                    debounce: debounce Time

            numeric(extends input): new numeric("id", setFunction, options)
                options for numeric are:
                    alias: display name
                    default: default value
                    debounce: debounce Time
                    min: minimum value
                    max: maximum value

            check(extends input): new check("id", setFunction, options)
                options for check are:
                    alias: display name
                    default: default value
                    debounce: debounce Time

            if alias is null the console does not log updates
            debounce defines the time after the last input in ms to wait before updating the option, if null updates immediately
*/