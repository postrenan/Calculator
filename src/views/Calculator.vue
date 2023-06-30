<template>
  <div class="columns allContent">
    <div class="column is-8  ">
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
              <button class="button is-rounded is-danger is-outlined is-hovered specialButton" @click="backspace"><-</button>
              <button class="button is-rounded is-warning  is-outlined is-hovered specialButton" @click="clear">AC</button>
              <button class="button is-rounded operatorBtn" @click="addOperator('²')">x²</button>
              <button class="button is-rounded operatorBtn" @click="addOperator('%')">%</button>
            </div>
            <div class="column is-paddingless divColumns is-mobile is-centered">
              <button class="button is-rounded operatorBtn" @click="addOperator('π')">π</button>
              <button class="button is-rounded operatorBtn" @click="addOperator('(')">(</button>
              <button class="button is-rounded operatorBtn" @click="addOperator(')')">)</button>
              <button class="button is-rounded operatorBtn" @click="addOperator('*')">*</button>
            </div>
            <div class="column is-paddingless divColumns is-mobile is-centered">
              <button class="button is-rounded " @click="addNumber(7)">7</button>
              <button class="button is-rounded " @click="addNumber(8)"> 8</button>
              <button class="button is-rounded " @click="addNumber(9)"> 9</button>
              <button class="button is-rounded  operatorBtn" @click="addOperator('/')">/</button>
            </div>
            <div class="column is-paddingless divColumns is-mobile is-centered">
              <button class="button is-rounded" @click="addNumber(4)">4</button>
              <button class="button is-rounded" @click="addNumber(5)">5</button>
              <button class="button is-rounded" @click="addNumber(6)">6</button>
              <button class="button is-rounded operatorBtn" @click="addOperator('-')">-</button>
            </div>
            <div class="column is-paddingless divColumns is-mobile is-centered">
              <button class="button is-rounded" @click="addNumber(1)">1</button>
              <button class="button is-rounded" @click="addNumber(2)">2</button>
              <button class="button is-rounded" @click="addNumber(3)">3</button>
              <button class="button is-rounded operatorBtn" @click="addOperator('+')">+</button>
            </div>
            <div class="column is-paddingless divColumns is-mobile is-centered">
              <router-link class="button is-rounded specialButton" to="/calculadora-juros-compostos">Juros</router-link>
              <button class="button is-rounded" @click="addNumber(0)">0</button>
              <button class="button  is-rounded" @click="addOperator('.')">.</button>
              <button class="button is-rounded is-success is-outlined is-hovered specialButton" @click="equal">=</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column is-desktop is-laptop is-3">
      <div class="section columns is-mobile  is-centered historyBlock">
        <div class="columns is-mobile is-half  ">

          <div class="box historyBack has-text-centered">
            <h1 class="title ">Histórico</h1>
            <div>
              <button @click="cleanHist()" class="is-centered button  buttonClean">Limpar</button>
              <p class="box historyValue" v-for="x in history">{{ x }}</p>
            </div>

          </div>
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
      const lastChar = this.current.slice(-1);
      if (lastChar.includes("%")) this.current += "*";
      if (lastChar.includes("π")) this.current += "*";
      this.current += num
    },
    addOperator(operator) {
      const isOperator = ["+", "-", "*", "/", "%", "!", "."];
      const specOperators = ["²", "π"];
      const isParenthesis = "(";
      const lastChar = this.current.slice(-1);
      if (!this.current) {
        this.theErrorMsg = "Não pode operador antes de numero";
        this.showAlert();
        return;
      }
      if (isOperator.includes(lastChar) && isOperator.includes(operator)) {
        this.theErrorMsg = "Não é aceito mais de um operador por vez";
        this.showAlert();
        return;
      }
      if (specOperators.includes(lastChar)) {
        this.theErrorMsg = "Não é aceito mais de um operador por vez";
        this.showAlert();
        return;
      }
      if (!isOperator.includes(lastChar) && operator.includes(isParenthesis)) this.current += "*";
      this.current = this.current + operator;
    },
    verifyParenthesis(value) {
      let parOpenPos = value.indexOf('(')
      let parClosePos = value.indexOf(')')
      if (value.includes("(") || value.includes(")")) {
        if (Math.abs(parOpenPos - parClosePos) === 1 || parClosePos === 0) {
          this.theErrorMsg = "Não é possivel conta com parenteses vazios";
          this.showAlert();
          return false;
        }
        if ((value.includes("(") && !value.includes(")")) || (value.includes(")") && !value.includes("("))) {
          this.theErrorMsg = "Não é possivel conta com parenteses unico";
          this.showAlert();
          return false;
        }
        if (Math.abs(parOpenPos - parClosePos) > 1) return true;
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
      this.current = this.current.substring(0, (this.current.length - 1));
    },
    operatorVerify(){
      const operators = ["+", "-", "*", "/", "%", "!", "."];
      return operators.some((operator) => this.current.includes(operator))
    },
    equal() {
      if (!this.current) return;
      if(!this.operatorVerify()) return;
      if (this.current.includes("(") || this.current.includes(")")) {if (!this.verifyParenthesis(this.current)) return;
      }
      this.shuntingYard(this.tokenize(this.current))
      this.previousEquation = this.current;
      this.previousResult = this.result;
      if (isNaN(this.result)) {
        this.theErrorMsg = "Não foi possivel calcular"
        this.showAlert()
        this.previousEquation = "";
        this.previousResult = "";
        return;
      }
      console.log(this.history)
      this.history.unshift(this.previousEquation + '=' + this.previousResult);
      this.current = "";
      console.log(this.history);
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
            this.showAlert();
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
      const operators = {"+": 1, "-": 1, "*": 1, "/": 1, "%": 1, 'π': 1, '²': 1, "!": 1};
      const leftAssoc = {"*": 1, "/": 1, "%": 1, "+": 1, "-": 1, 'π': 1, '²': 1,"!": 1};
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
          if (!foundLeftParen) {
            this.theErrorMsg = "Não foi possível encontrar o parenteses, verifique";
            this.showAlert();
            throw new Error("Não foi possível encontrar o parenteses, verifique");
          }
        } else {
          this.theErrorMsg = `Caractere desconhecido: ${ch}`;
          this.showAlert();
          return;
        }
      }
      while (stack.length > 0) {
        const c = stack.pop();
        if (c === "(" || c === ")") {
          this.theErrorMsg = "Não foi possível encontrar o parenteses, verifique";
          this.showAlert();
          throw new Error("Não foi possível encontrar o parenteses, verifique");
        }
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
              this.showAlert();
              this.current = "";
              return;
            } else {
              result = operand1 / operand2;
            }
          }
          if (token === "π") result = parseFloat(operand2 * 3.14);
          if (token === "²") result = operand2 * operand2;
          if (token === "!") {
            let a = 0;
            for(let i = operand2 - 1; i > 0; i--){
              a = (a === 0 ? operand2 : a  ) * i;
            }
            result = a;
          }
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
      if (keyCode === 13) this.equal();
    },
    showAlert() {
      this.msgError = true;
      setTimeout(() => {
        this.msgError = false;
      }, 2000);
    },
  },

}
</script>

<style scoped>

* {
  font-weight: bold;
}

.calculatorBack {
  padding: 20px 0 20px 0;
  border-radius: 100% ;
}

.allContent{
  margin: 0 0 0 0;
  padding-top: 50px;
}

.calculatorAll {
  background-color: rgba(175, 240, 248, 0.91);
  border: white solid 2px;
  padding: 1px;
  max-width: 400px;
}

.display {
  background-color: #D9AFD9;
  background-image: linear-gradient(180deg, #D9AFD9 0%, #97D9E1 100%);
  color: black;
  padding-bottom: 5px;
  padding-left: 5px;
  min-height: 89px;
  margin-top: 2px;
}

.previousResult {
  word-break: break-word;
  font-size: 20px;
  color: black;
}

.inputEntry {
  background-color: rgba(217, 175, 217, 0.49);
  border: black solid 1px;
  outline: none;
  text-align: right;
  width: 100%;
  font-size: 20px;
  border-radius: 5px;
  color: black;
  word-break: break-all;
}

.divColumns {
  margin: 5px;
  max-width: 400px;
}

.backgroundButtons {
  background-color: white;
  max-width: 400px;
  padding-top: 15px;
  margin-top: -20px;
}


button {
  background-color: #e1e1e1;
  color: #000000;
  margin: 10px;
  border: #000000 solid 2px;
  width: 55px;
  font-size: 20px;
}

.operatorBtn {
  background-color: #e1e1e1;
  box-shadow: none;
  max-width: 56px;
  border: #000000 solid 2px;
  margin: 10px;
  width: 55px;
  font-size: 20px;
  color: black;
}

.buttonClean {
  background-color: white;
  padding: 10px;
  margin: 0 0 10px 0;
  width: auto;
  font-size: 20px;
  border: black solid 2px;
}

.specialButton {
  background-color: #e1e1e1;
  color: black;
  max-width: 56px;
  border: solid 2px;
  margin: 10px;
  width: 55px;
  font-size: 20px;
}

.historyBlock {
  margin: 0;
  padding: 48px 0 0 20px;
}

.historyBack {
  background-color: #D9AFD9;
  background-image: linear-gradient(180deg, #D9AFD9 45%, #97D9E1 74%);
  border: white solid 2px;
  width: 400px;
  max-width: 400px;
  height: auto;
  max-height: 583px;
  overflow: auto;
}

.historyValue {
  word-break: break-all;
  background-color: #fcfcfc;
  color: black;
  border: black solid 2px;
}

@media only screen and (max-width: 1400px) {

  .allContent{
    margin: -30px 0 0 0;
    padding-top: 0;
  }

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
    margin-bottom: 120px;
  }

.previousResult{
  font-size: 10px;
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
    border: #000000 solid 1px;
    max-width: 40px;
  }

  .operatorBtn {
    background-color: white;
    margin: 4px;
    font-size: 10px;
    border: #000000 solid 1px;
    max-width: 40px;

  }

  .specialButton {
    margin: 4px;
    font-size: 10px;
    max-width: 40px;
    border: solid 1px;
  }

  .historyBlock{
    margin-top: 40px;
  }

  .historyBack {
    padding: 0;
    max-height: 180px;
  }

  .buttonClean {
    scale: 1.4;
    font-size: 10px;
    margin: 0 0 25px 10px;
  border: #00b2ff solid 1px;

  }

}

@media only screen and (max-width: 570px) {

  .calculatorAll {
    scale: 1.8;
    margin-top: 300px;
    padding: 1px;
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
    border: #000000 solid 1px;
  }

  .divColumns {
    margin: 3px;
  }

  button {
    width: 30px;
    font-size: 8px;
    border: #000000 solid 1px;
  }

  .specialButton {
    margin: 3px;
    font-size: 8px;
    width: 30px;
    border: #000000 solid 1px;
  }

  .operatorBtn {
    background-color: #ffffff;
    margin: 3px;
    font-size: 8px;
    width: 30px;
    border: #000000 solid 1px;
  }

  .historyBack {
    scale: 1.3;
    width: 280px;
    max-width: 370px;
    padding: 10px 5px 15px 5px;

  }

  .buttonClean {
    font-size: 8px;
    border: #00b2ff solid 1px;
    margin: 0 0 25px 25px;
  }

}

@media only screen and (max-width: 393px) {
  .calculatorAll {
    scale: 1.8;
    margin-top: 130px;
    padding: 1px;
    font-size: 10px;
  }

  .calculatorBack {
    margin: 0;
    padding: 0;
  }

  .display {
    max-height: 120px;
    padding: 0 0 -20px 2px;
    margin: 0;
  }

  .previousResult {
    font-size: 10px;
  }

  .inputEntry {
    max-width: 180px;
  }

  .backgroundButtons {
    padding: 5px;
  }

  .divColumns {
    margin: 3px;
  }

  button {
    width: 20px;
    font-size: 8px;
    border: #000000 solid 1px;
  }

  .operatorBtn {
    background-color: #ffffff;
    margin: 3px;
    font-size: 8px;
    width: 20px;
    border: #000000 solid 1px;
  }

  .buttonClean{
    border: #00b2ff solid 1px;

  }

  .specialButton {
    margin: 3px;
    font-size: 8px;
    width: 20px;
    border: solid 1px;
  }



  .historyBlock {
    margin: 0;
    padding: 40px 0 0 0;
  }

  .historyBack {
    width: 190px;
    padding: 10px;
    max-width: 300px;
    font-size: 10px
  }

}
</style>