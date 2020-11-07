import { CodeLens } from "vscode";




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
}

export class Stm extends Base {
  private states: State[] = [];
  add_state(name: string) {
    let index: number = this.search_name_in_array(name, this.states);
    if (index === -1) {
      let state = new State();
      state.set_name(name);
      this.states.push(state);
    }
  }
  add_transition(state_name: string, transition_name: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].add_transition_name(transition_name);
    }
  }

  add_condition(state_name: string, transition_name: string, condition: string) {
    let index: number = this.search_name_in_array(state_name, this.states);
    if (index !== -1) {
      this.states[index].add_transition(transition_name, condition);
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
        sm_transitions += `${state_name} => ${i_transition.get_name()} : ${i_transition.get_condition()};\n`;
      });
    });
    return sm_states + sm_transitions;
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

  add_transition(name: string, condition: string) {
    let transition_index: number = this.search_name_in_array(name, this.transitions);
    if (transition_index === -1) {
      let transition = new Transition();
      transition.set_name(name);
      transition.set_condition(condition);
      this.transitions.push(transition);
    }
    else {
      let transition = new Transition();
      transition.set_name(name);
      transition.set_condition(condition);
      this.transitions[transition_index] = transition;
    }
  }
  add_transition_name(name: string) {
    let transition_index: number = this.search_name_in_array(name, this.transitions);
    if (transition_index === -1) {
      let transition = new Transition();
      transition.set_name(name);
      this.transitions.push(transition);
    }
  }
  add_transition_condition(name: string, condition: string): boolean {
    let transition_index: number = this.search_name_in_array(name, this.transitions);
    if (transition_index !== -1) {
      this.add_transition(name, condition);
      return true;
    }
    return false;
  }
}


class Transition {
  private condition: Condition = new Condition();
  private name: string = '';

  clear() {
    this.condition = new Condition();
    this.name = '';
  }

  set_condition(condition: string) {
    this.condition.set_condition(condition);
  }
  get_condition(): string {
    return this.condition.get_condition();
  }
  set_name(name: string) {
    this.name = name;
  }
  get_name(): string {
    return this.name;
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
