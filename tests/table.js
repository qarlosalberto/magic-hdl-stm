class Table {
  constructor(table_dom) {
    this.table = table_dom;
  }
  add_stm_table(stm) {
    // stm = stm.reverse();
    this.table.innerHTML = '';
    for (let i = 0; i < stm.length; ++i) {
      this.add_state_table(stm[i]);
    }
  }

  add_state_table(state) {
    this.add_state_name_table(state.name);
    for (let i = 0; i < state.transitions.length; ++i) {
      this.add_state_transition_table(state.name, state.transitions[i]);
    }
  }

  add_state_name_table(name) {
    let row = this.table.insertRow(0);
    row.style.backgroundColor = '#ffd78c';
    let cell = row.insertCell(0);
    cell.innerHTML = name;
    cell.colSpan = '2';
    cell.stm_type = "state";
    cell.stm_state_name = name;
  }

  add_state_transition_table(state_name, transition) {
    let row = this.table.insertRow(0);
    row.style.backgroundColor = 'grey';
    let cell_destination = row.insertCell();
    cell_destination.innerHTML = transition.destination;
    cell_destination.style.width = '50%';
    let cell_condition = row.insertCell();
    cell_condition.innerHTML = transition.condition;
    cell_condition.style.width = '50%';

    cell_destination.stm_type = "transition";
    cell_destination.stm_state_name = state_name;
    cell_destination.destination = transition.destination;
    cell_destination.condition = transition.condition;

    cell_condition.stm_type = "transition";
    cell_condition.stm_state_name = state_name;
    cell_condition.destination = transition.destination;
    cell_condition.condition = transition.condition;
  }
}