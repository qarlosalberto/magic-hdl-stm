import { stringify } from "querystring";
// import smcat = require("state-machine-cat");

// import { smcat } from "../node_modules/state-machine-cat/src/";
// import smcat from "state-machine-cat/src";
import { render } from "state-machine-cat";

class Base {
  search_name_in_array(name: string, arr): number {
    let index: number = -1;
    arr.forEach(function (x, i) {
      if (x.get_name() === name) {
        index = i;
      }
    });
    return index;
  }
  search_destination_in_array(name: string, arr): number {
    let index: number = -1;
    arr.forEach(function (x, i) {
      if (x.get_destination() === name) {
        index = i;
      }
    });
    return index;
  }
  search_destination_condition_in_array(destination: string, condition: string, arr): number {
    let index: number = -1;
    arr.forEach(function (x, i) {
      if (x.get_destination() === destination && x.get_condition() === condition) {
        index = i;
      }
    });
    return index;
  }
}

export class Stm extends Base {
  private states: State[] = [];
  get_svg(): string {
    let svg = render(this.get_smcat(), { outputType: "svg" });
    return svg;
  }

  remove_state(name: string) {
    let index: number = this.search_name_in_array(name, this.states);
    if (index !== -1) {
      this.states.splice(index, 1);
    }
  }

  remove_transition(state_name: string, destination: string, condition: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].remove_transition(destination, condition);
    }
  }


  add_state(name: string) {
    let index: number = this.search_name_in_array(name, this.states);
    if (index === -1) {
      let state = new State();
      state.set_name(name);
      this.states.push(state);
    }
  }
  add_transition(state_name: string, destination: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    //State exists
    if (index !== -1) {
      //Add transition to the state
      this.states[index].add_transition(destination);
    }
    //State doesn't exists
    else {
      //Create new state
      this.add_state(state_name);
      //Add transition to the state
      this.add_transition(state_name, destination);
    }
  }

  add_condition(state_name: string, destination: string, condition: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    //State exists
    if (index !== -1) {
      this.states[index].add_condition_to_transition(destination, condition);
    }
    //State doesn't exists
    else {
      //Create new state
      this.add_state(state_name);
      //Add transition to the state
      this.add_transition(state_name, destination);
      //Add condition
      this.add_condition(state_name, destination, condition);
    }
  }

  clear() {
    this.states = [];
  }

  get_smcat(): string {
    let smcat: string = '';
    let sm_states: string = '';
    let sm_transitions: string = '';
    let num_states = this.states.length;

    this.states.forEach(function (i_state, i) {
      let transitions = i_state.get_transitions();
      let state_name = i_state.get_name();
      sm_states += `${state_name}`;
      if (i !== num_states - 1) {
        sm_states += ',';
      }
      else {
        sm_states += ';\n';
      }
      transitions.forEach(function (i_transition, j) {
        sm_transitions += `${state_name} => ${i_transition.get_destination()} : ${i_transition.get_condition()};\n`;
      });
    });
    return sm_states + sm_transitions;
  }


  get_object() {
    type transition_type = { destination: string, condition: string };
    type state_type = { name: string, transitions: transition_type[] };

    let stm: state_type[] = [];
    this.states.forEach(function (i_state, i) {
      let transitions = i_state.get_transitions();
      let state_name = i_state.get_name();
      let state: { name: string, transitions: transition_type[] } = { name: '', transitions: [] };
      state.name = state_name;

      transitions.forEach(function (i_transition, j) {
        let transition: transition_type = { destination: '', condition: '' };
        transition.destination = i_transition.get_destination();
        transition.condition = i_transition.get_condition();
        state.transitions.push(transition);
      });
      stm.push(state);
    });
    return stm;
  }


}


export class State extends Base {
  private transitions: Transition[] = [];
  private name: string = '';

  get_transitions() {
    return this.transitions;
  }

  clear() {
    this.transitions = [];
    this.name = '';
  }

  set_name(name: string) {
    this.name = name;
  }
  get_name() {
    return this.name;
  }

  remove_transition(destination: string, condition) {
    let index: number = this.search_destination_condition_in_array(destination, condition, this.transitions);
    if (index !== -1) {
      this.transitions.splice(index, 1);
    }
  }

  add_transition(destination: string) {
    let index: number = this.search_destination_in_array(destination, this.transitions);
    //Destination doesn't exist
    if (index === -1) {
      let transition = new Transition();
      transition.set_destination(destination);
      this.transitions.push(transition);
    }
  }

  add_condition_to_transition(destination: string, condition: string) {
    let index: number = this.search_destination_in_array(destination, this.transitions);
    //Destination exists
    if (index !== -1) {
      let transition = this.transitions[index];
      transition.set_condition(condition);
    }
    //Destination doesn't exist
    else {
      let transition = new Transition();
      transition.set_destination(destination);
      this.transitions.push(transition);
      this.add_condition_to_transition(destination, condition);
    }
  }
}


class Transition {
  private condition: Condition = new Condition();
  private destination: string = '';

  clear() {
    this.condition = new Condition();
    this.destination = '';
  }

  set_condition(condition: string) {
    this.condition.set_condition(condition);
  }
  get_condition(): string {
    return this.condition.get_condition();
  }
  set_destination(destination: string) {
    this.destination = destination;
  }
  get_destination(): string {
    return this.destination;
  }
}

class Condition {
  private condition: string = '';
  set_condition(new_condition: string) {
    this.condition = new_condition;
  }
  get_condition(): string {
    return this.condition;
  }
}
