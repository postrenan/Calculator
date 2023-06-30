<template>
  <div id="app">
    <div class="section  is-mobile is-centered">
      <div class="section columns is-mobile is-centered ">
        <div class="is-mobile is-half is-centered  box calculatorBack">
          <div class="is-paddingless">
            <h2 class="title">Calculadora de juros compostos</h2>
            <p>Valor inicial(capital)</p>
            <input v-model="initialValue" autofocus  id="input1" class="input is-rounded" type="number" min="0">
            <p>Taxa de juros a.a</p>
            <input v-model="interestRate" id="input2" class="input is-rounded" type="number" min="0" max="100">
            <p>Tempo de rendimento (a.a)</p>
            <input v-model="incomeTime" id="input3" @keydown.enter="feesEquation" class="input is-rounded" type="number" min="0" max="100">
            <h1 v-if="msgError === ''" class="subtitle subtitleResultStyle">Resultado: R$ {{ feesResult }}</h1>
            <h1 v-else class="subtitle subtitleResultStyle">{{ msgError }}</h1>
          </div>
          <div class="columns">
            <div class="column has-text-left">
              <button @click="feesEquation" class="button is-rounded">Calcular</button>
              <button @click="clearInputs" class="button is-rounded">CA</button>
              <button @click="turnFees" class="button is-rounded ">Juros S.</button>
            </div>
            <div class="column has-text-right rightColumBtn">
              <button @click="closeFees" class="button is-rounded is-danger buttonClose ">X</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns is-mobile is-half is-centered ">
      <div class="column is-mobile is-half has-text-centered is-centered box historyBack">
        <p class="box boxHistory">Capital - Juros - Tempo - Rendimento</p>
        <p class="box boxHistory" v-for=" feesResult in history">{{ feesResult.value }} - {{ feesResult.fees }} -
          {{ feesResult.time }} Meses - {{ feesResult.result }}</p>
        <button @click="cleanHist" class="is-centered is-rounded button">Limpar</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CompoundFees",
  data() {
    return {
      incomeTime: '',
      initialValue: '',
      interestRate: '',
      feesResult: 0,
      history: [],
      msgError: '',
    }
  },
  mounted() {
    document.addEventListener('keypress', this.keyListener);
    document.addEventListener('keydown', this.supportKeyListener);
  },
  methods: {
    cleanHist() {
      this.history = [];
    },
    closeFees() {
      this.$router.push('/');
    },
    clearInputs() {
      this.incomeTime = '';
      this.initialValue = '';
      this.interestRate = '';
    },
    feesEquation() {
      if (this.initialValue > 0 && this.incomeTime > 0) {
        this.interestRate = this.interestRate / 100;
        this.feesResult = (this.initialValue * ((1 + this.interestRate) ** this.incomeTime));
        this.feesResult = this.feesResult.toFixed(2);

        this.history.unshift({
          value: this.initialValue,
          fees: this.interestRate,
          time: this.incomeTime,
          result: this.feesResult,
        })
        this.incomeTime = '';
        this.initialValue = '';
        this.interestRate = '';
      } else {
        this.msgError = 'Verifique se as areas foram preenchidas ' +
            'e valores estão corretos';
        setTimeout(() => {
          this.msgError = '';
        }, 2000);
      }
    },
    turnFees() {
      this.$router.push('/calculadora-juros-simples');
    },

  },

}
</script>

<style scoped>

.calculatorBack {
  width: 529px;
  border: white solid 2px;
  background-color: #D9AFD9;
  background-image: linear-gradient(180deg, #D9AFD9 0%, #97D9E1 100%);
}

.subtitleResultStyle {
  margin: 10px 0 10px 0;
  min-height: 40px;
  border-radius: 100px;
  text-align: left;
  padding-top: 8px;
  padding-left: 10px;
  color: #000000;
  font-weight: bold;
}

input{
  background-color: #ffffff;
  color: #000000;
  font-weight: bold;
}

.title {
  color: #050505;
}

p {
  color: #000000;
  font-weight: bold;
}


input {
  border: #000000 solid 1px;
}

button {
  margin: 5px;
  border: #000000 solid 1px;
  background-color: white;
  color: black;
  font-weight: bold;
}

.rightColumBtn{
  max-width: 80px;
  padding: 12px 12px 0 0;
}

.historyBack {
  max-width: 529px;
  border: white solid 1px;
  background-color: #D9AFD9;
  background-image: linear-gradient(0deg, #D9AFD9 45%, #97D9E1 74%);
}


.boxHistory {
  border: black solid 1px;
  color: black;
  background-color: white;
  font-weight: bold;
}
</style>