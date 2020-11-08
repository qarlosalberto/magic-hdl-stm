
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let state_0 = {
  'name': 's0',
  'transitions': []
};

let transition_0_0 = {
  'destination': 's1',
  'condition': 'a>10'
};


let transition_0_1 = {
  'destination': 's2',
  'condition': 'a=10'
};

state_0.transitions.push(transition_0_0);
state_0.transitions.push(transition_0_1);

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let state_1 = {
  'name': 's1',
  'transitions': []
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

let state_2 = {
  'name': 's2',
  'transitions': []
};

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
let stm = [];

stm.push(state_0);
stm.push(state_1);
stm.push(state_2);

let table = document.getElementById("table");

add_stm_table(stm);


function add_stm_table(stm) {
  for (let i = 0; i < stm.length; ++i) {
    add_state_table(stm[i]);
  }

}

function add_state_table(state) {
  add_state_name_table(state.name);
  for (let i = 0; i < state.transitions.length; ++i) {
    add_state_transition_table(state.transitions[i]);
  }
}

function add_state_name_table(name) {
  let row = table.insertRow(0);
  row.style.backgroundColor = '#ffd78c';
  let cell = row.insertCell(0);
  cell.innerHTML = name;
  cell.colSpan = '2';
}

function add_state_transition_table(transition) {
  let row = table.insertRow(0);
  row.style.backgroundColor = 'grey';
  let cell_destination = row.insertCell();
  cell_destination.innerHTML = transition.destination;
  cell_destination.style.width = '50%';
  let cell_condition = row.insertCell();
  cell_condition.innerHTML = transition.condition;
  cell_condition.style.width = '50%';
}

oncontextmenu = (e) => {
  e.preventDefault();
  let menu = document.createElement("div");
  menu.id = "ctxmenu";
  menu.style = `top:${e.pageY}px;left:${e.pageX}px`;
  menu.onmouseleave = function () { ctxmenu.outerHTML = ''; };
  menu.innerHTML = "<p>Option1</p><p>Option2</p><p>Option3</p><p>Option4</p><p onclick='alert(`Thank you!`)'>Upvote</p>";
  document.body.appendChild(menu);
};




