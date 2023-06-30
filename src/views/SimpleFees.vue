<template>
  <div id="app">
    <div class="section  is-mobile is-centered allCalculator">
      <div class="section columns is-mobile is-centered ">
        <div class="is-mobile is-half is-centered  box calculatorBack">
          <div class="is-paddingless">
            <h2 class="title">Calculadora de juros simples</h2>
            <p>Valor inicial(capital)</p>
            <input v-model="valueSimple" autofocus id="input1" class="input is-rounded" type="number" min="0">
            <p>Taxa de juros (a.a)</p>
            <input v-model="rateSimple" id="input2" class="input is-rounded" type="number" min="0" max="100">
            <p>Tempo de rendimento (a.a)</p>
            <input v-model="timeSimple" @keydown.enter="feesEquation" id="input3" class="input is-rounded" type="number" min="0" max="100">
            <h1 class="subtitle subtitleResultStyle">Juros: R$ {{ feesSimpleResult }} </h1>
            <h1 v-if="msgError === ''" class="subtitle subtitleResultStyle">Montante : R$ {{ feesWithValue }} </h1>
            <h1 v-else class="subtitle subtitleResultStyle">{{ msgError }}</h1>
          </div>
          <div class="columns">
            <div class="column has-text-left">
              <button @click="feesEquation"  class="button is-rounded">Calcular</button>
              <button @click="clearInputs" class="button is-rounded">CA</button>
              <button @click="turnFees" class="button is-rounded ">Juros C.</button>
            </div>
            <div class="column has-text-right rightColumBtn">
              <button @click="closeFees" class="button is-rounded is-danger buttonClose ">X</button>
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-mobile is-half is-centered ">
        <div class="column is-mobile is-half has-text-centered is-centered box historyBack">
          <p class="box boxHistory">Capital - Juros - Tempo - Rendimento</p>
          <p class="box boxHistory" v-for=" feesSimpleResult in history">{{ feesSimpleResult.value }} -
            {{ feesSimpleResult.fees }} -
            {{ feesSimpleResult.time }} Meses - {{ feesSimpleResult.result }}</p>
          <button @click="cleanHist" class="is-centered is-rounded button">Limpar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SimpleFees",
  data() {
    return {
      timeSimple: '',
      valueSimple: '',
      rateSimple: '',
      feesSimpleResult: 0,
      history: [],
      feesWithValue: 0,
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
      this.timeSimple = '';
      this.valueSimple = '';
      this.rateSimple = '';
    },
    feesEquation() {
      if (this.timeSimple > 0 && this.valueSimple > 0) {
        this.rateSimple = ((this.rateSimple / 100) / 12).toFixed(2);
        this.feesSimpleResult = (parseFloat(this.valueSimple) + (parseFloat(this.rateSimple) * parseFloat(this.timeSimple) * parseFloat(this.valueSimple)));
        if(this.feesResult === Infinity) window.location.replace("https://www.youtube.com/watch?v=2nD10biL4xo&ab_channel=RenatoMartins");
        this.feesSimpleResult = this.feesSimpleResult.toFixed(2)
        this.feesWithValue = parseFloat(this.feesSimpleResult) + parseFloat(this.valueSimple);
        this.history.unshift({
          value: this.valueSimple,
          fees: this.rateSimple,
          time: this.timeSimple,
          result: this.feesSimpleResult,
        })
        this.incomeTime = 0;
        this.initialValue = 0;
        this.interestRate = 0;
      } else {
        this.msgError = 'Verifique se as areas foram preenchidas ' + 'e valores estão corretos';
        setTimeout(() => {
          this.msgError = '';
        }, 2000);
      }
    },
    turnFees() {
      this.$router.push('/calculadora-juros-compostos')
    },
  },
}
</script>

<style scoped>


.calculatorBack {
  width: 529px;
  border: white solid 2px;
  background-color: black;
}

.subtitleResultStyle {
  margin: 10px 0 10px 0;
  min-height: 40px;
  border-radius: 100px;
  text-align: left;
  padding-top: 8px;
  padding-left: 10px;
  color: white;
  font-weight: bold;
}

input{
  background-color: black;
  border: white solid 2px;
  color: white;
  font-weight: bold;
}

.title {
  color: white;
}

p {
  color: white;
  font-weight: bold;
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
  background-color: black;
}


.boxHistory {
  border: black solid 1px;
  color: black;
  background-color: white;
  font-weight: bold;
}

</style>