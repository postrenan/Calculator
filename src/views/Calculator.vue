<template>
  <div class="allContent">
    <div class="section columns is-mobile is-centered calculatorBack">
      <div class="is-mobile is-half is-centered column box calculatorAll">
        <div class="column box has-text-right is-rounded display">
          <p v-if="msgError">{{ theErrorMsg }}</p>
          <div v-if="!msgError">
            <p class="previousResult">{{ previousResult }}</p>
          </div>
          <input v-model="current" :disabled="true" type="text" class="inputEntry">
        </div>
        <div class="is-mobile is-centered column has-text-centered box backgroundButtons">
          <div class="column is-paddingless is-vcentered divColumns is-mobile is-centered ">
            <button class="button is-danger  specialButton" @click="backspace"><-</button>
            <button class="button is-warning  specialButton" @click="clear">CA</button>
            <button class="button  operatorBtn" @click="addOperator('²')">x²</button>
            <button class="button  operatorBtn" @click="addOperator('%')">%</button>

          </div>
          <div class="column is-paddingless divColumns is-mobile is-centered">
            <button class="button  operatorBtn" @click="addOperator('π')">π</button>
            <button class="button  operatorBtn" @click="addOperator('(')">(</button>
            <button class="button  operatorBtn" @click="addOperator(')')">)</button>
            <button class="button  operatorBtn" @click="addOperator('*')">*</button>
          </div>
          <div class="column is-paddingless divColumns is-mobile is-centered">
            <button class="button " @click="addNumber(7)">7</button>
            <button class="button " @click="addNumber(8)"> 8</button>
            <button class="button " @click="addNumber(9)"> 9</button>
            <button class="button  operatorBtn" @click="addOperator('/')">/</button>
          </div>
          <div class="column is-paddingless divColumns is-mobile is-centered">
            <button class="button " @click="addNumber(4)">4</button>
            <button class="button " @click="addNumber(5)">5</button>
            <button class="button " @click="addNumber(6)">6</button>
            <button class="button  operatorBtn" @click="addOperator('-')">-</button>
          </div>
          <div class="column is-paddingless divColumns is-mobile is-centered">
            <button class="button " @click="addNumber(1)">1</button>
            <button class="button " @click="addNumber(2)">2</button>
            <button class="button " @click="addNumber(3)">3</button>
            <button class="button  operatorBtn" @click="addOperator('+')">+</button>
          </div>
          <div class="column is-paddingless divColumns is-mobile is-centered">
            <router-link class="button  specialButton" to="/calculadora-juros-compostos">J.</router-link>
            <button class="button " @click="addNumber(0)">0</button>
            <button class="button  " @click="addOperator('.')">.</button>
            <button class="button  specialButton" @click="equal">=</button>
          </div>
        </div>
      </div>
    </div>
    <div class="section columns is-mobile  is-centered historyBlock">
      <div class="columns is-mobile is-half  ">
        <div class="box historyBack">
          <p class="box historyValue" v-for=" x in history">{{ previousEquation + "=" + result }}</p>
          <button @click="cleanHist()" class="is-centered button  buttonClean">Limpar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Simple",
  data() {
    return {
      previousEquation: "",
      previousResult: "",
      current: "",
      result: 0,
      length: "",
      history: [],
      theErrorMsg: "",
      msgError: false,
    }
  },
  mounted() {
    document.addEventListener('keypress', this.keyListener);
    document.addEventListener('keydown', this.supportKeyListener);
  },
  methods: {
    addNumber(num) {
      this.current += num
    },
    addOperator(operator) {
      const isOperator = ["+", "-", "*", "/", "%", "!", "."];
      const isParenthesis = "(";
      if (!this.current) {
        this.theErrorMsg = "Não pode operador antes de numero";
        this.msgError = true;
        setTimeout(() => {
          this.msgError = false;
        }, 2000);
        return;
      }
      const lastChar = this.current.slice(-1);
      if (isOperator.includes(lastChar) && isOperator.includes(operator)) {
        this.theErrorMsg = "Não é aceito mais de um operador por vez";
        this.msgError = true;
        setTimeout(() => {
          this.msgError = false;
        }, 2000);
        return;
      }
      if(!isOperator.includes(lastChar)  && operator.includes(isParenthesis)) this.current += '*';

      this.current = this.current + operator;
    },
    verifyOperator() {
      const isOperator = ['+', '-', '*', '/', '%', '!'];
      if (this.current.includes(isOperator)) {
        return true;
      } else {
        this.theErrorMsg = "Não é possivel conta sem operadores";
        this.msgError = true;
        setTimeout(() => {
          this.msgError = false;
        }, 2000);
        return false;
      }
    },
    verifyParenthesis(value) {
      if (value.includes( "(" )) {
        let parenthesisOpenPos = value.indexOf('(')
        let parenthesisClosePos = value.indexOf(')')
        if (Math.abs(parenthesisOpenPos - parenthesisClosePos) === 1 || parenthesisClosePos === 0) {

          this.theErrorMsg = "Não é possivel conta com parenteses vazios";
          this.msgError = true;
          setTimeout(() => {
            this.msgError = false;
          }, 2000);
          return false;
        }
      } else if (value.includes(")")) {

        this.theErrorMsg = "Não é possivel conta com parenteses unico";
        this.msgError = true;
        setTimeout(() => {
          this.msgError = false;
        }, 2000);
        return false;
      } else {
        return true;
      }
    },
    cleanHist() {
      this.history = [];
    },
    clear() {
      this.current = "";
      this.result = "";
      this.previousResult = "";
    },
    backspace() {
      this.length = this.current.length;
      this.current = this.current.substring(0, (this.length - 1));
    },
    equal() {
      if (!this.current) return;
      if(!this.verifyParenthesis(this.current)) return;
      this.shuntingYard(this.tokenize(this.current))
      this.previousEquation = this.current;
      this.previousResult = this.result;
      if (isNaN(this.result)) {
        this.previousResult = "Não foi possivel calcular"
        this.previousEquation = "";
        this.previousResult = "";
        return;
      }
      this.history.unshift(this.previousEquation + '=' + this.previousResult);
      this.current = "";
    },
    tokenize(infix) {
      const tokens = [];
      let number = '';
      let hasDot = false;
      for (const char of infix) {
        if (char.match(/[0-9]/)) number += char;
        else if (char === '.') {
          if (hasDot) {
            this.theErrorMsg = `Não é aceito mais de um ponto`;
            this.msgError = true;
            setTimeout(() => {
              this.msgError = false;
            }, 2000);
            throw new Error("Invalid number format: More than one dot");
          }
          number += char;
          hasDot = true;
        } else {
          if (number !== "") {
            tokens.push(number);
            number = "";
            hasDot = false;
          }
          if (char.trim() !== "") tokens.push(char);
        }
      }
      if (number !== "") tokens.push(number);
      return tokens;
    },
    shuntingYard(current) {
      const operators = {"+": 1, "-": 1, "*": 1, "/": 1, "%": 1, 'π': 1, '²': 1};
      const leftAssoc = {"*": 1, "/": 1, "%": 1, "+": 1, "-": 1, 'π': 1, '²': 1};
      const rightAssoc = {"=": 1, "!": 1};
      const precedenceOf = {"!": 4, "*": 3, "/": 3, 'π': 3, '²': 3, "%": 3, "+": 2, "-": 2, "=": 1};
      let output = [];
      let stack = [];
      for (let k = 0; k < current.length; k++) {
        const ch = current[k];
        if (ch === " ") continue;

        if (/\d/.test(ch)) {
          output.push(ch);
        } else if (ch in operators) {
          const op1 = ch;
          while (stack.length > 0) {
            const op2 = stack[stack.length - 1];
            if (op2 in operators && (
                (op1 in leftAssoc && (precedenceOf[op1] <= precedenceOf[op2])) ||
                (op1 in rightAssoc && (precedenceOf[op1] < precedenceOf[op2]))
            )) {
              output.push(stack.pop());
            } else {
              break;
            }
          }
          stack.push(op1);
        } else if (ch === "(") {
          stack.push(ch);
        } else if (ch === ")") {
          let foundLeftParen = false;
          while (stack.length > 0) {
            const c = stack.pop();
            if (c === "(") {
              foundLeftParen = true;
              break;
            } else {
              output.push(c);
            }
          }
          if (!foundLeftParen) throw new Error("Não foi possível encontrar o parenteses, verifique");
        } else {
          this.theErrorMsg = `Caractere desconhecido: ${ch}`;
          this.msgError = true;
          setTimeout(() => {
            this.msgError = false;
          }, 2000);
          this.current = "";
        }
      }
      while (stack.length > 0) {
        const c = stack.pop();
        if (c === "(" || c === ")") throw new Error("Não foi possível encontrar o parenteses, verifique");
        output.push(c);
      }
      this.processOutput(output);
    },
    processOutput(tokens) {
      const stack = [];
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const operators = {"+": 1, "-": 1, "*": 1, "/": 1, ",": 1, "!": 1, "π": 1, "²": 1, "%": 1};
        if (!isNaN(parseFloat(token))) {
          stack.push(parseFloat(token));
        }
        if (token in operators) {
          const operand2 = stack.pop();
          const operand1 = stack.pop();
          let result;

          if (token === "+") result = operand1 + operand2;
          if (token === "-") result = operand1 - operand2;
          if (token === "*") result = operand1 * operand2;
          if (token === "/") {
            if (operand2 === 0) {
              this.theErrorMsg = "não é possivel divisão por 0"
              this.msgError = true;
              setTimeout(() => {
                this.msgError = false;
              }, 2000);
              this.current = "";
              return;
            } else {
              result = operand1 / operand2;
            }
          }
          if (token === "π") result = parseFloat(operand2 * 3.14);
          if (token === "²") result = operand2 * operand2;
          if (token === "!") result = -operand1;
          if (token === "%") result = parseFloat(operand2 / 100);
          stack.push(result);
        }
      }
      this.result = stack.pop();
    },
    keyListener(keyWord) {
      const keyCode = keyWord.keyCode;
      const numberKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57];
      const operationKeys = [33, 37, 40, 41, 42, 43, 45, 46, 47, 178,];
      if (numberKeys.includes(keyCode)) {
        const digit = String.fromCharCode(keyCode);
        this.addNumber(digit);
      } else if (operationKeys.includes(keyCode)) {
        const digit = String.fromCharCode(keyCode);
        this.addOperator(digit);
      }
    },
    supportKeyListener(keyWord) {
      const keyCode = keyWord.keyCode;
      if (keyCode === 8) this.backspace();

      if (keyCode === 13) this.equal()
    },
  },

}
</script>

<style scoped>
* {
  font-weight: bold;
}

.calculatorBack {
  margin: 0;
  padding: 20px 0 0 0;
}


.calculatorAll {
  background-color: #1c1a1a;
  padding: 3px;
  max-width: 400px;
}

.display {
  background-color: #cecbcb;
  color: rgba(12, 11, 11, 0.9);
  margin-bottom: 2px;
  padding-bottom: 5px;
  padding-left: 5px;
  min-height: 89px;
  margin-top: 5px;
}

.previousResult {
  word-break: break-word;
}

.inputEntry {
  background-color: darkgrey;
  border: solid 1px black;
  outline: none;
  text-align: right;
  width: 100%;
  font-size: 15px;
  border-radius: 20px;
  color: #1c1a1a;
  word-break: break-all;
}

.divColumns {
  margin: 5px;
  max-width: 400px;
}

.backgroundButtons {
  background-color: #44596b;
  max-width: 400px;
}


button {
  margin: 10px;
  border: #1c1a1a solid 3px;
  width: 55px;
}

.operatorBtn {
  background-color: #a5bda5;
  box-shadow: none;
  max-width: 56px;
  border: #1c1a1a solid 3px;
  margin: 10px;
  width: 55px;
  font-size: 15px;
}

.buttonClean {
  width: 70px;

}

.specialButton {
  max-width: 56px;
  border: #1c1a1a solid 3px;
  margin: 10px;
  width: 55px;
  font-size: 15px;
}

.historyBlock {
  margin: 0;
}

.historyBack {
  background-color: darkgrey;
  width: 400px;
  max-width: 400px;
}

.historyValue {
  word-break: break-all;
}

@media only screen and (max-width: 800px) {
  .calculatorBack {
    margin: 0;
    padding: 0;
  }

  .calculatorAll {
    scale: 1.8;
    margin-top: 200px;
    padding: 2px;
    font-size: 10px;
    max-width: 300px;
    margin-bottom: 280px;
  }


  .inputEntry {

    max-width: 275px;
    font-size: 10px;
  }

  .divColumns {
    margin: 0;
  }

  button {
    margin: 4px;
    font-size: 10px;
    border: none;
    max-width: 40px;
  }

  .specialButton {
    margin: 4px;
    font-size: 10px;
    max-width: 40px;
    border: none;
  }

  .historyBack {
    scale: 1.4;
  }

  .buttonClean {
    scale: 1.4;
  }

}

@media only screen and (max-width: 570px) {

  .calculatorAll {
    scale: 1.8;
    margin-top: 300px;
    padding: 2px;
    font-size: 10px;
  }

  .calculatorBack {
    margin: 0;
    padding: 0;
  }

  .display {
    max-width: 380px;
    height: 50px;
    max-height: 50px;
    padding: 5px;
  }

  .inputEntry {
    max-width: 200px;
  }

  .divColumns {
    margin: 3px;
  }

  button {
    width: 30px;
    font-size: 8px;
    border: none;
  }

  .specialButton {
    margin: 3px;
    font-size: 8px;
    width: 30px;
    border: none;
  }

  .historyBack {
    width: 280px;
    max-width: 370px;
    padding: 15px 0 15px 0;
  }

  .buttonClean {

    margin: 0 0 0 30px;
  }

}

@media only screen and (max-width: 393px) {

  .calculatorAll {
    scale: 1.8;
    margin-top: 300px;
    padding: 2px;
    font-size: 10px;
  }

  .calculatorBack {
    margin: 0;
    padding: 0;
  }

  .display {
    max-width: 360px;
    padding: 0 0 -20px 2px;
  }

  .inputEntry {
    max-width: 180px;
  }

  .backgroundButtons {
    padding: 0;
  }

  .divColumns {
    margin: 3px;
  }

  button {
    width: 20px;
    font-size: 8px;
    border: none;
  }

  .specialButton {
    margin: 3px;
    font-size: 8px;
    width: 20px;
    border: none;
  }

  .historyBack {
    width: 190px;
    max-width: 300px;
  }

}
</style>