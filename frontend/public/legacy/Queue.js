class Node{
    constructor(v = "", n = null){
        this.val = v;
        this.next = n;
        this.size = 0;
    }
}

class Queue{
    constructor(){
        this.head = new Node();
        this.tail = this.head;
        this.size = 0;
    }

    enqueue(item){
        this.tail.next = new Node(item);
        this.tail = this.tail.next;
        this.size++;
    }

    dequeue(){
        if (this.tail == this.head || !this.size){
            return undefined;
        }
        let v = this.head.next.val;
        this.head.next = this.head.next.next;
        if (this.head.next == null) {
            this.tail = this.head;
        }
        this.size--;
        return v;
    }

    join(val = " "){
        let s = ""
        let curr = this.head;
        while (curr != this.tail){
            if (curr != this.head){
                s += val;
            }
            s += curr.next.val;
            curr = curr.next;
        }

        return s;
    }

    empty(){
        return this.head == this.tail;
    }

    peek(){
        return this.head == this.tail ? undefined : this.head.next.val;
    }
}