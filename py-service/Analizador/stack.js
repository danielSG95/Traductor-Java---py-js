
class stack{
    constructor() {
        this.stack = [];
    }


    Push(element) {
        this.stack.push(element);
    }

    Pop(){
        return this.stack.pop();
    }

    Peek(){
        var temp = this.stack[this.stack.length -1 ];
        return temp;
    }

    Empty() {
        return this.stack.length == 0;
    }
}

module.exports.stack = stack;