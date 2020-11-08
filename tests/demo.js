
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

add_stm(stm);


function add_stm(stm) {
  for (let i = 0; i < stm.length; ++i) {
    add_state(stm[i]);
  }

}

function add_state(state) {
  add_state_name(state.name);
  for (let i = 0; i < state.transitions.length; ++i) {
    add_state_transition(state.transitions[i]);
  }
}

function add_state_name(name) {
  let row = table.insertRow(0);
  row.style.backgroundColor = '#ffd78c';
  let cell = row.insertCell(0);
  cell.innerHTML = name;
  cell.colSpan = '2';
}

function add_state_transition(transition) {
  let row = table.insertRow(0);
  row.style.backgroundColor = 'grey';
  let cell_destination = row.insertCell();
  cell_destination.innerHTML = transition.destination;
  cell_destination.style.width = '50%';
  let cell_condition = row.insertCell();
  cell_condition.innerHTML = transition.condition;
  cell_condition.style.width = '50%';
}

