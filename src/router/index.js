import Vue from "vue";
import VueRouter from "vue-router";
import Calculator from "../views/Calculator.vue"
import CompoundFees from "../views/CompoundFees.vue";
import SimpleFees from "@/views/SimpleFees.vue";

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    base: import.meta.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "Calculator",
            component: Calculator,
        },
        {
            path: "/calculadora-juros-compostos",
            name: "CompoundFees",
            component: CompoundFees,
        },
        {
            path: "/calculadora-juros-simples",
            name: "SimpleFees",
            component: SimpleFees,
        }
    ],
});

export default router;
