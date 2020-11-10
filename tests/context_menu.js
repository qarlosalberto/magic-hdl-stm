/* eslint-disable @typescript-eslint/class-name-casing */
import { Stm } from "../out/src/stm_manager";

export class Contexmenu {
  constructor(stm_table) {
    this.stm = new Stm();
    this.stm_table = stm_table;
    // this.clickable = document.getElementById('table');
    this.clickable = document;
    this.menu_state = document.getElementById('menu_state');
    this.menu_transition = document.getElementById('menu_transition');
    this.out_click = document.getElementById('out-click');

    this.out_click.addEventListener('click', () => {
      this.hidden_menu();
    });

    this.clickable.addEventListener('contextmenu', e => {
      e.preventDefault();
      //Menu state
      let menu;

      let state_name = e.target.stm_state_name;
      if (e.target.stm_type === 'state') {
        menu = menu_state;
        this.configure_menu_state(state_name, "state");
      }
      else if (e.target.stm_type === 'transition') {
        menu = menu_state;
        let destination = e.target.destination;
        let condition = e.target.condition;
        this.configure_menu_state(state_name, "transition", destination, condition);
      }
      else {
        menu = menu_state;
        this.configure_menu_state(state_name, "other");
      }
      menu.style.top = `${e.clientY}px`;
      menu.style.left = `${e.clientX}px`;
      menu.classList.add('show');
      this.out_click.style.display = "block";
    });
    this.insert_state = new Insert_state(this.stm, this.stm_table);
    this.insert_transition = new Insert_transition(this.stm, this.stm_table);
  }

  configure_menu_state(state_name, type, destination, condition) {
    let element = this;
    menu_state.innerHTML = '';

    let li_0 = document.createElement("li");
    li_0.setAttribute("class", "menu-item");
    li_0.appendChild(document.createTextNode("Add new state"));
    menu_state.appendChild(li_0);
    li_0.addEventListener('click', function () {
      element.menu_add_state();
    });

    if (type === "transition") {
      let li_1 = document.createElement("li");
      li_1.setAttribute("class", "menu-item");
      li_1.appendChild(document.createTextNode("Remove transition"));
      menu_state.appendChild(li_1);
      li_1.addEventListener('click', function () {
        element.menu_remove_transition(state_name, destination, condition);
      });
    }


    if (type !== "other") {
      let li_2 = document.createElement("li");
      li_2.setAttribute("class", "menu-item");
      li_2.appendChild(document.createTextNode("Add transition"));
      menu_state.appendChild(li_2);
      li_2.addEventListener('click', function () {
        element.menu_add_transition(state_name);
      });

      let li_3 = document.createElement("li");
      li_3.setAttribute("class", "menu-item");
      li_3.appendChild(document.createTextNode("Remove state"));
      menu_state.appendChild(li_3);
      li_3.addEventListener('click', function () {
        element.menu_remove_state(state_name);
      });
    }
  }

  hidden_menu() {
    this.menu_state.classList.remove('show');
    this.menu_transition.classList.remove('show');
    this.out_click.style.display = "none";
  }

  menu_add_state() {
    this.hidden_menu();
    this.insert_state.show();
  }
  menu_remove_state(state_name) {
    this.hidden_menu();
    this.insert_state.remove_state(state_name);
  }
  menu_remove_transition(state_name, destination, condition) {
    this.hidden_menu();
    this.insert_transition.remove_transition(state_name, destination, condition);
  }
  menu_add_transition(state_name) {
    this.hidden_menu();
    this.insert_transition.set_state(state_name);
    this.insert_transition.show();
  }

  cancel_button_event() {
    this.hidden_insert();
  }

  insert_button_event() {
    this.hidden_insert();
  }



  hidden_insert() {
    this.insert_state.hidden();
  }
}





class Insert_state {
  constructor(stm_table, table) {
    this.stm_table = stm_table;
    this.table_manager = table;
    this.table = document.getElementById('table');
    this.div = document.getElementById('i_state');
    this.insert_button = document.getElementById('i_state_insert');
    this.cancel_button = document.getElementById('i_state_cancel');
    this.state_name_box = document.getElementById('i_state_name');
    this.svg = document.getElementById('svg');
    this.state;

    let element = this;
    this.insert_button.addEventListener('click', () => {
      this.insert_button_event(element);
    });
    this.cancel_button.addEventListener('click', () => {
      this.cancel_button_event(element);
    });
  }
  insert_button_event() {
    let state_name = this.state_name_box.value;
    this.stm_table.add_state(state_name);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    this.svg.innerHTML = "";
    this.svg.innerHTML = svg;
    this.hidden();
  }
  cancel_button_event() {
    this.hidden();
  }

  remove_state(state_name) {
    this.stm_table.remove_state(state_name);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    this.svg.innerHTML = "";
    this.svg.innerHTML = svg;
    this.hidden();
  }

  hidden() {
    this.div.hidden = true;
    this.table.hidden = false;
  }
  show() {
    this.div.hidden = false;
    this.table.hidden = true;
  }
}


class Insert_transition {
  constructor(stm_table, table) {
    this.stm_table = stm_table;
    this.table_manager = table;
    this.table = document.getElementById('table');
    this.div = document.getElementById('i_tran');
    this.insert_button = document.getElementById('i_tran_insert');
    this.cancel_button = document.getElementById('i_tran_cancel');
    this.destination_box = document.getElementById('i_tran_dest');
    this.condition_box = document.getElementById('i_tran_cond');
    this.state_name = '';
    this.svg = document.getElementById('svg');

    let element = this;
    this.insert_button.addEventListener('click', () => {
      this.insert_button_event(element);
    });
    this.cancel_button.addEventListener('click', () => {
      this.cancel_button_event(element);
    });


  }
  insert_button_event() {
    let state_name = this.state_name;
    let destination = this.destination_box.value;
    let condition = this.condition_box.value;
    this.stm_table.add_condition(state_name, destination, condition);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    this.svg.innerHTML = "";
    this.svg.innerHTML = svg;
    this.hidden();
  }

  remove_transition(state_name, destination, condition) {
    this.stm_table.remove_transition(state_name, destination, condition);
    let table_array = this.stm_table.get_object();
    this.table_manager.add_stm_table(table_array);
    let svg = this.stm_table.get_svg();
    this.svg.innerHTML = "";
    this.svg.innerHTML = svg;
    this.hidden();
  }

  cancel_button_event() {
    this.hidden();
  }

  hidden() {
    this.div.hidden = true;
    this.table.hidden = false;
  }
  set_state(state_name) {
    this.state_name = state_name;
  }
  show() {
    this.div.hidden = false;
    this.table.hidden = true;
  }
}














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



