import { Table } from "./table";
import { Contexmenu } from "./context_menu";
// import svgPanZoom from "svg-pan-zoom/src/svg-pan-zoom.js";

// svgPanZoom("#svg");


let table = document.getElementById("table");
let stm_table = new Table(table);
new Contexmenu(stm_table);


