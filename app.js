class Calcu {

  static evalExp() {
    let inputValue = document.getElementById("opsInput").value, str = '';
    const strRPN = this.toRpn(inputValue);
    const calcRPN = this.calcRPN(strRPN);
    str = `RPN = [${strRPN}] / RESULT = ${calcRPN}`;
    document.getElementById('output').innerHTML = str;
  }

  static calcRPN(rpn) {
    const optr = '-+/*()';
    let outQ = [], result = 0, op1 = '', op2 = '';
    rpn.forEach((x) => {
      if(optr.indexOf(x) > -1) {
        op2 = outQ.pop();
        op1 = outQ.pop();

        switch (x) {
          case '-':
            result = parseFloat(op1) - parseFloat(op2);
            outQ.push(result);
            break;
          case '+':
            result = parseFloat(op1) + parseFloat(op2);
            outQ.push(result);
            break;
          case '*':
            result = parseFloat(op1) * parseFloat(op2);
            outQ.push(result);
            break;
          case '/':
            result = parseFloat(op1) / parseFloat(op2);
            outQ.push(result);
            break;
        }
      } else {
        if (x!=undefined) outQ.push(x);
      }
    })
    return outQ;
  }

  static toRpn(str) {
    /*--Algorithm from Wikipedia ---
    while there are tokens to be read do:
      read a token.
      if the token is a number, then:
          push it to the output queue.
      if the token is a function then:
          push it onto the operator stack
      if the token is an operator, then:
          while ((there is a function at the top of the operator stack)
                 or (there is an operator at the top of the operator stack with greater precedence)
                 or (the operator at the top of the operator stack has equal precedence and the token is left associative))
                and (the operator at the top of the operator stack is not a left parenthesis):
              pop operators from the operator stack onto the output queue.
          push it onto the operator stack.
      if the token is a left paren (i.e. "("), then:
          push it onto the operator stack.
      if the token is a right paren (i.e. ")"), then:
          while the operator at the top of the operator stack is not a left paren:
              pop the operator from the operator stack onto the output queue.
          // If the stack runs out without finding a left paren, then there are mismatched parentheses.
          if there is a left paren at the top of the operator stack, then:
              pop the operator from the operator stack and discard it

      // After while loop, if operator stack not null, pop everything to output queue
    if there are no more tokens to read then:
      while there are still operator tokens on the stack:
        // If the operator token on the top of the stack is a paren, then there are mismatched parentheses.
        pop the operator from the operator stack onto the output queue.
    exit.
    -------------*/

    //Now using Algorithm from Wikipedia
    const optr = '-+/*()';
    let i = 0, queue = [], stack = [], arrStr = [], num = "", lFlag = true, tmp = "", lTrue = true;
    let topStack, fq = new Array();

    arrStr = this.mySplit(str);

    arrStr.forEach((token) => {
      if (optr.indexOf(token) === -1) queue.push(token); //number or operand
      else {
        if (token != '(' || token != ')') {
          while (this.chkPre(this.peek(stack)) >= this.chkPre(token) && this.peek(stack) != '(') {
            tmp = stack.pop();
            if(tmp != undefined) queue.push(tmp);
            if (stack.length <= 0) {
              console.log('mismatched ()');
              break;
            }
          }
          if(token != ')') stack.push(token);
        }
        if (token === '(') stack.push();
        if (token === ')') {
          while (this.peek(stack) != '(' && this.peek(stack) != undefined) {
            tmp = stack.pop();
            if (tmp != undefined) queue.push(tmp);
          }
          if (this.peek(stack) === '(') stack.pop();
        }
      }
    }); //arrStr.forEach((token)

    while (stack.length > 0) {
      tmp = stack.pop();
      if (tmp != undefined) queue.push(tmp);
    }
    return(queue);
  } //toRpn

  static peek(stack) {
      let stackVal;
      stackVal = stack.pop();
      stack.push(stackVal);
      return stackVal;
  }

  static mySplit(s) {
      const optr = '-+/*()';
      let i=0, arrStr = [], str = "";
      //iterate the string
      for(i=0; i < s.length; i++) {
        if( optr.indexOf(s[i]) > -1) { //check if the current character is an operator
          if (str.length > 0) {         //if the string accumulator is not empty, then save the accumulated string into the new array and save also the current character (which is an operator) into the new array
            arrStr.push(str);
            arrStr.push(s[i]);
            str = ""                   //reset the string accumulator to ready for the next string of operands
          } else arrStr.push(s[i]);    //save the current character (operator) into the new array
        } else {
          str += s[i];                //accumulate the string
        }
      }
      if (str.length > 0 ) arrStr.push(str); //if there are remaining string operand, save it into the new array
      return arrStr;
  }

  static chkPre(x) {
    let n = 0;
    switch(x) {
      case "(": n = 20;
        break;
      case ")": n = 20;
        break;
      case "*": n = 15;
        break;
      case "/": n = 15;
        break;
      case "+": n = 14;
        break;
      case "-": n = 14;
        break;
    }
    return n;
  }

} //Class Calcu

document.getElementById("opsInput").addEventListener('input',(e) => {
  e.preventDefault();
  const regex = RegExp(/[abcdefghijklmnopqrstuvwxyz\!\@\#\$\%\^\&\~\`\,\?\>\<\;\:\"\'\[\]\_\s]/); //To not include characters unless it's a number or an operator (+-/*)
  if (regex.test(e.target.value)) {
    document.getElementById("output").innerHTML = "Please enter numbers and operators only";
    setTimeout((e) => {
      document.getElementById("output").innerHTML = "";
    }, 3000)
    e.target.value = e.target.value.slice(0,e.target.value.length-1) //remove that character that's not a number or an operator
  }
})
