import * as stm_manager from "../src/stm_manager";

let stm = new stm_manager.Stm();
stm.add_state('s0');
stm.add_state('s1');
stm.add_transition('s0', 's1');
stm.add_condition('s0', 's1', 'a>b');
stm.add_transition('s1', 's0');
stm.add_condition('s1', 's0', 'a!b');
console.log(stm.get_smcat());
