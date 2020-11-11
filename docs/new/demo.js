import { Table } from "../table";
import { Contexmenu } from "../context_menu";
import Viz from 'viz.js';

console.log("hola")
console.log(Viz)

let table = document.getElementById("table");
let stm_table = new Table(table);
new Contexmenu(stm_table);


