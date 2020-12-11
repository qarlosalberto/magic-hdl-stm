// Copyright 2020 Carlos Alberto Ruiz Naranjo
//
// This file is part of magic-hdl-stm.
//
// magic-hdl-stm is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// magic-hdl-stm is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with magic-hdl-stm.  If not, see <https://www.gnu.org/licenses/>.

import { get_hdl_code } from "./stm_hdl";
import { render } from "state-machine-cat";

////////////////////////////////////////////////////////////////////////////////
// Base
////////////////////////////////////////////////////////////////////////////////
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
  search_output_in_array(output: string, arr): number {
    let index: number = -1;
    arr.forEach(function (x, i) {
      if (x.get_output() === output) {
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

////////////////////////////////////////////////////////////////////////////////
// Stm
////////////////////////////////////////////////////////////////////////////////
export class Stm extends Base {
  private states: State[] = [];

  private config = {
    'state_name': '',
    'clock_name': '',
    'reset_condition': '',
    'reset_state': '',
    'reset_enable': false
  };

  get_hdl_code(language: string) {
    let reset_condition = this.config.reset_condition;
    let reset_state = this.config.reset_state;
    if (this.config.reset_enable === false) {
      reset_condition = '';
      reset_state = '';
    }
    let hdl_code: string = get_hdl_code(language,
      reset_condition, reset_state, this.config.state_name, this.config.clock_name, this.get_object());
    console.log(hdl_code);
    return hdl_code;
  }

  get_config() {
    return this.config;
  }

  set_config(config) {
    this.config = config;
  }

  load_json(json) {
    this.clear();
    let config = {
      'state_name': json.state_name,
      'clock_name': json.clock_name,
      'reset_condition': json.reset_condition,
      'reset_state': json.reset_state,
      'reset_enable': json.reset_enable
    };
    this.set_config(config);
    let stm = json.stm;
    for (let i = 0; i < stm.length; ++i) {
      let state = stm[i];
      this.add_state(state.name);
      for (let j = 0; j < state.outputs.length; ++j) {
        let output = state.outputs[j];
        this.add_output(state.name, output);
      }
      for (let j = 0; j < state.transitions.length; ++j) {
        let transition = state.transitions[j];
        this.add_condition(state.name, transition.destination, transition.condition);
      }
    }
  }

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

  add_output(state_name: string, output: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].add_output(output);
    }
  }

  edit_output(state_name: string, old_output: string, new_output: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].edit_output(old_output, new_output);
    }
  }

  remove_output(state_name: string, output: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].remove_output(output);
    }
  }

  remove_transition(state_name: string, destination: string, condition: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].remove_transition(destination, condition);
    }
  }

  edit_transition(state_name: string, old_destination: string, old_condition: string,
    new_destination: string, new_condition: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].edit_transition(old_destination, old_condition, new_destination, new_condition);
    }
  }

  edit_state(state_name: string, old_output: string, new_output: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].edit_output(old_output, new_output);
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
    type state_type = { name: string, transitions: transition_type[], outputs: string[] };
    type stm_complete_type = { state_name: string, clock_name: string, reset_enable: boolean, reset_state: string, reset_condition: string, stm: state_type[] };

    let stm: state_type[] = [];
    let stm_complete: stm_complete_type = { state_name: '', clock_name: '', reset_enable: false, reset_state: '', reset_condition: '', stm: [] };

    stm_complete.state_name = this.config.state_name;
    stm_complete.clock_name = this.config.clock_name;
    stm_complete.reset_state = this.config.reset_state;
    stm_complete.reset_condition = this.config.reset_condition;
    stm_complete.reset_enable = this.config.reset_enable;

    this.states.forEach(function (i_state, i) {
      let transitions = i_state.get_transitions();
      let outputs = i_state.get_outputs();
      let state_name = i_state.get_name();
      let state: { name: string, transitions: transition_type[], outputs: string[] } =
        { name: '', transitions: [], outputs: [] };
      state.name = state_name;

      outputs.forEach(function (i_output, j) {
        state.outputs.push(i_output.get_output());
      });

      transitions.forEach(function (i_transition, j) {
        let transition: transition_type = { destination: '', condition: '' };
        transition.destination = i_transition.get_destination();
        transition.condition = i_transition.get_condition();
        state.transitions.push(transition);
      });
      stm.push(state);
    });
    stm_complete.stm = stm;
    return stm_complete;
  }
}

////////////////////////////////////////////////////////////////////////////////
// State
////////////////////////////////////////////////////////////////////////////////
export class State extends Base {
  private transitions: Transition[] = [];
  private outputs: Output[] = [];
  private name: string = '';

  get_transitions() {
    return this.transitions;
  }

  get_outputs() {
    return this.outputs;
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

  edit_output(old_output: string, new_output: string) {
    let index: number = this.search_output_in_array(old_output, this.outputs);
    //Output exists
    if (index !== -1) {
      this.outputs[index].set_output(new_output);
    }
  }

  add_output(output: string) {
    let index: number = this.search_output_in_array(output, this.outputs);
    //Output doesn't exist
    if (index === -1) {
      let output_n = new Output();
      output_n.set_output(output);
      this.outputs.push(output_n);
    }
  }

  remove_output(output: string) {
    let index: number = this.search_output_in_array(output, this.outputs);
    if (index !== -1) {
      this.outputs.splice(index, 1);
    }
  }

  remove_transition(destination: string, condition) {
    let index: number = this.search_destination_condition_in_array(destination, condition, this.transitions);
    if (index !== -1) {
      this.transitions.splice(index, 1);
    }
  }

  edit_transition(old_destination: string, old_condition, new_destination: string, new_condition) {
    let index: number = this.search_destination_condition_in_array(old_destination, old_condition, this.transitions);
    if (index !== -1) {
      this.transitions[index].set_destination(new_destination);
      this.transitions[index].set_condition(new_condition);
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

////////////////////////////////////////////////////////////////////////////////
// Transition
////////////////////////////////////////////////////////////////////////////////
class Transition extends Base {
  private condition: Condition = new Condition();
  private destination: string = '';
  private outputs: Output[] = [];

  clear() {
    this.condition = new Condition();
    this.destination = '';
  }

  add_output(output: string) {
    let index: number = this.search_output_in_array(output, this.outputs);
    //Output doesn't exist
    if (index === -1) {
      let output_n = new Output();
      output_n.set_output(output);
      this.outputs.push(output_n);
    }
  }

  remove_output(output: string) {
    let index: number = this.search_output_in_array(output, this.outputs);
    if (index !== -1) {
      this.outputs.splice(index, 1);
    }
  }

  get_outputs() {
    return this.outputs;
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

////////////////////////////////////////////////////////////////////////////////
// Condition
////////////////////////////////////////////////////////////////////////////////
class Condition {
  private condition: string = '';
  set_condition(new_condition: string) {
    this.condition = new_condition;
  }
  get_condition(): string {
    return this.condition;
  }
}

////////////////////////////////////////////////////////////////////////////////
// Output
////////////////////////////////////////////////////////////////////////////////
class Output {
  private output: string = '';
  set_output(new_output: string) {
    this.output = new_output;
  }
  get_output(): string {
    return this.output;
  }
}