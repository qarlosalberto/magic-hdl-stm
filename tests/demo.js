import { render } from "state-machine-cat";
import { Table } from "./table";
import { Contexmenu } from "./context_menu";

let pText = `
initial => backlog;
backlog => doing;
doing => test;`;


let pepe = render(pText)



// let stm = new Stm();
let table = document.getElementById("table");

let stm_table = new Table(table);
// stm_table.add_stm_table(stm);

let context_menu = new Contexmenu(stm_table);


// function add_stm_table(stm) {
//   for (let i = 0; i < stm.length; ++i) {
//     add_state_table(stm[i]);
//   }

// }

// function add_state_table(state) {
//   add_state_name_table(state.name);
//   for (let i = 0; i < state.transitions.length; ++i) {
//     add_state_transition_table(state.name, state.transitions[i]);
//   }
// }

// function add_state_name_table(name) {
//   let row = table.insertRow(0);
//   row.style.backgroundColor = '#ffd78c';
//   let cell = row.insertCell(0);
//   cell.innerHTML = name;
//   cell.colSpan = '2';
//   cell.stm_type = "state";
//   cell.stm_state_name = name;
// }

// function add_state_transition_table(state_name, transition) {
//   let row = table.insertRow(0);
//   row.style.backgroundColor = 'grey';
//   let cell_destination = row.insertCell();
//   cell_destination.innerHTML = transition.destination;
//   cell_destination.style.width = '50%';
//   let cell_condition = row.insertCell();
//   cell_condition.innerHTML = transition.condition;
//   cell_condition.style.width = '50%';

//   cell_destination.stm_type = "transition";
//   cell_destination.stm_state_name = state_name;
//   cell_destination.destination = transition.destination;
//   cell_destination.condition = transition.condition;

//   cell_condition.stm_type = "transition";
//   cell_condition.stm_state_name = state_name;
//   cell_condition.destination = transition.destination;
//   cell_condition.condition = transition.condition;
// }


// const insert = document.getElementById('insert');
// document.getElementById('insert_button').addEventListener('click', insert_button_event);
// document.getElementById('cancel_button').addEventListener('click', cancel_button_event);




// const clickable = document.getElementById('table');
// // const menu = document.getElementById('menu');
// const menu_state = document.getElementById('menu_state');
// const menu_transition = document.getElementById('menu_transition');
// const outClick = document.getElementById('out-click');

// clickable.addEventListener('contextmenu', e => {
//   e.preventDefault();
//   //Menu state
//   let menu;
//   let state_name = e.target.stm_state_name;
//   if (e.target.stm_type === 'state') {
//     menu = menu_state;
//     configure_menu_state(state_name);
//   }
//   else if (e.target.stm_type === 'transition') {
//     menu = menu_transition;
//   }
//   menu.style.top = `${e.clientY}px`;
//   menu.style.left = `${e.clientX}px`;
//   menu.classList.add('show');
//   outClick.style.display = "block";
// });

// function configure_menu_state(state_name) {
//   menu_state.innerHTML = '';

//   let li_0 = document.createElement("li");
//   li_0.setAttribute("class", "menu-item");
//   li_0.appendChild(document.createTextNode("Add new state"));
//   menu_state.appendChild(li_0);
//   li_0.addEventListener("click", menu_add_state);


//   let li_1 = document.createElement("li");
//   li_1.setAttribute("class", "menu-item");
//   li_1.appendChild(document.createTextNode("Add transition"));
//   menu_state.appendChild(li_1);
//   li_1.addEventListener('click', function () {
//     menu_add_transition(state_name);
//   });

//   let li_2 = document.createElement("li");
//   li_2.setAttribute("class", "menu-item");
//   li_2.appendChild(document.createTextNode("Add new state"));
//   menu_state.appendChild(li_2);
//   li_2.addEventListener('click', function () {
//     menu_remove_state(state_name);
//   });
// }

// function menu_add_state() {
//   hidden_menu();
//   hidden_table();
// }
// function menu_remove_state(state_name) {
//   hidden_menu();
// }
// function menu_add_transition(state_name) {
//   hidden_menu();

// }

// function cancel_button_event() {
//   hidden_insert();
// }

// function insert_button_event() {
//   hidden_insert();
// }

// function hidden_table() {
//   insert.hidden = false;
//   table.hidden = true;
// }

// function hidden_insert() {
//   insert.hidden = true;
//   table.hidden = false;
// }

// outClick.addEventListener('click', () => {
//   hidden_menu();
// });

// function hidden_menu() {
//   menu_state.classList.remove('show');
//   menu_transition.classList.remove('show');
//   outClick.style.display = "none";
// }


