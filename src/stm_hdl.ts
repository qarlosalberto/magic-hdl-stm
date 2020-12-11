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

/* eslint-disable @typescript-eslint/class-name-casing */
export function get_hdl_code(language: string,
  reset_signal: string, reset_state: string, state_name: string, clock_name: string, complete): string {
  let stm = complete.stm;
  let type = "one_process";
  let stm_hdl: string = "";
  if (language === "vhdl") {
    let stm_vhdl = new Vhdl_code();
    stm_hdl = stm_vhdl.get_vhdl_code(type, reset_signal, reset_state, state_name, clock_name, stm);
  }
  else if (language === "verilog") {
    let stm_vhdl = new Verilog_code();
    stm_hdl = stm_vhdl.get_verilog_code(type, reset_signal, reset_state, state_name, clock_name, stm);
  }
  return stm_hdl;
}

////////////////////////////////////////////////////////////////////////////////
// VHDL
////////////////////////////////////////////////////////////////////////////////
class Vhdl_code {
  private indent: string = "  ";
  private indent1: string = "  ";
  private indent2: string = this.indent1 + this.indent1;
  private indent3: string = this.indent2 + this.indent;
  private indent4: string = this.indent3 + this.indent;


  get_vhdl_code(type: string, reset_signal: string, reset_state: string,
    state_name: string, clock_name: string, stm): string {
    let stm_hdl: string = "";
    if (type === "one_process") {
      stm_hdl = this.get_vhdl_one_process(reset_signal, reset_state, state_name, clock_name, stm);
    }
    return stm_hdl;
  }

  get_vhdl_one_process(reset_signal: string, reset_state: string, state_name: string, clock_name: string, stm): string {
    let stm_hdl: string = this.example_state_declaration(state_name, stm);
    stm_hdl += this.open_process(clock_name);
    let extra_indent = '';
    if (reset_signal !== '' && reset_state !== '') {
      stm_hdl += this.open_reset(reset_signal, reset_state, state_name);
      extra_indent = this.indent1;
    }
    stm_hdl += this.open_case(state_name, extra_indent);
    for (let i = 0; i < stm.length; ++i) {
      if (stm[i].transitions.length !== 0 || stm[i].outputs.length !== 0) {
        stm_hdl += this.open_when(stm[i].name, extra_indent);
        stm_hdl += this.add_outputs(stm[i].outputs, extra_indent);
        if (stm[i].transitions.length !== 0) {
          stm_hdl += this.generate_if_case(stm[i].transitions, state_name, extra_indent);
        }
      }
    }
    stm_hdl += this.close_case(extra_indent);
    if (reset_signal !== '' && reset_state !== '') {
      stm_hdl += this.close_reset();
    }
    stm_hdl += this.close_process();
    return stm_hdl;
  }

  example_state_declaration(state_name: string, stm) {
    let str = '';

    str += `-- type t_${state_name} is (`;
    for (let i = 0; i < stm.length - 1; ++i) {
      str += `${stm[i].name}, `;
    }
    str += `${stm[stm.length - 1].name});\n`;
    str += `-- signal ${state_name} : type type_${state_name};\n\n`;
    return str;
  }

  open_reset(reset_signal: string, reset_state: string, state_name: string) {
    let str: string = "";
    str += this.indent1 + `if (${reset_signal} = '1') then\n`;
    str += this.indent2 + `${state_name} <= ${reset_state};\n`;
    str += this.indent1 + `else\n`;
    return str;
  }

  close_reset() {
    let str: string = "";
    str += this.indent1 + 'end if;\n';
    return str;
  }

  open_when(state_name: string, extra_indent: string) {
    let str: string = "";
    str += extra_indent + this.indent2 + `when ${state_name} =>\n`;
    return str;
  }

  add_outputs(outputs, extra_indent: string) {
    let str: string = "";
    for (let i = 0; i < outputs.length; ++i) {
      let output = outputs[i];
      output = output.trim();
      if (output[output.length - 1] !== ';') {
        output += ';';
      }
      str += extra_indent + this.indent3 + `${output}\n`;
    }
    return str;
  }

  generate_if_case(transitions, state_name: string, extra_indent: string) {
    let str: string = "";
    for (let i = 0; i < transitions.length; ++i) {
      if (i === 0) {
        str += extra_indent + this.indent3 + `if (${transitions[i].condition}) then\n`;
        str += extra_indent + this.indent4 + `${state_name} <= ${transitions[i].destination};\n`;
      }
      else {
        str += extra_indent + this.indent3 + `elsif (${transitions[i].condition}) then\n`;
        str += extra_indent + this.indent4 + `${state_name} <= ${transitions[i].destination};\n`;
      }
    }
    str += extra_indent + this.indent3 + "end if;\n";
    return str;
  }

  open_process(clock_name: string) {
    let str: string = "";
    str += `process(${clock_name})\nbegin\n`;
    return str;
  }

  close_process() {
    let str: string = "";
    str += "end process;\n";
    return str;
  }

  open_case(state_name: string, extra_indent: string) {
    let str: string = "";
    str += extra_indent + this.indent + `case ${state_name} is\n`;
    return str;
  }
  close_case(extra_indent: string) {
    let str: string = "";
    str += extra_indent + this.indent + "end case;\n";
    return str;
  }
}


////////////////////////////////////////////////////////////////////////////////
// Verilog
////////////////////////////////////////////////////////////////////////////////
class Verilog_code {
  private indent1: string = "  ";
  private indent2: string = this.indent1 + this.indent1;
  private indent3: string = this.indent2 + this.indent1;
  private indent4: string = this.indent3 + this.indent1;
  private indent5: string = this.indent4 + this.indent1;
  private indent6: string = this.indent5 + this.indent1;


  get_verilog_code(type: string, reset_signal: string, reset_state: string,
    state_name: string, clock_name: string, stm): string {
    let stm_hdl: string = "";
    if (type === "one_process") {
      stm_hdl = this.get_verilog_one_process(reset_signal, reset_state, state_name, clock_name, stm);

    }
    return stm_hdl;
  }

  get_verilog_one_process(reset_signal: string, reset_state: string, state_name: string, clock_name: string, stm): string {
    let stm_hdl: string = this.example_state_declaration(state_name, stm);
    let extra_indent = '';
    stm_hdl += this.open_process(clock_name);
    if (reset_signal !== '' && reset_state !== '') {
      stm_hdl += this.open_reset(reset_signal, reset_state, state_name);
      extra_indent = this.indent1;
    }
    stm_hdl += this.open_case(extra_indent);
    for (let i = 0; i < stm.length; ++i) {
      if (stm[i].transitions.length !== 0 || stm[i].outputs.length !== 0) {
        stm_hdl += this.open_when(stm[i].name, extra_indent);
        stm_hdl += this.add_outputs(stm[i].outputs, extra_indent);
        if (stm[i].transitions.length !== 0) {
          stm_hdl += this.generate_if_case(stm[i].transitions, state_name, extra_indent);
        }
        stm_hdl += this.close_when(extra_indent);
      }
    }
    stm_hdl += this.close_case(extra_indent);
    if (reset_signal !== '' && reset_state !== '') {
      stm_hdl += this.close_reset();
    }
    stm_hdl += this.close_process();
    return stm_hdl;
  }

  open_reset(reset_signal: string, reset_state: string, state_name: string) {
    let str = '';
    str += this.indent1 + `if (${reset_signal}) begin\n`;
    str += this.indent2 + `${state_name} = ${reset_state};\n`;
    str += this.indent1 + 'end\n';
    str += this.indent1 + 'else begin\n';
    return str;
  }

  close_reset() {
    let str: string = "";
    str += this.indent1 + 'end\n';
    return str;
  }

  example_state_declaration(state_name: string, stm) {
    let str = '';
    str += `//  reg [${stm.length}-1:0] ${state_name};\n`;
    str += '//  localparam \n';
    for (let i = 0; i < stm.length - 1; ++i) {
      str += '//  ' + this.indent1 + `${stm[i].name} = ${i},\n`;
    }
    str += '//  ' + this.indent1 + `${stm[stm.length - 1].name} = ${stm.length - 1};\n\n`;
    return str;
  }

  open_when(state_name: string, extra_indent: string) {
    let str: string = "";
    str += extra_indent + this.indent2 + `${state_name}:\n`;
    str += extra_indent + this.indent2 + `begin\n`;
    return str;
  }

  close_when(extra_indent: string) {
    let str: string = "";
    str += extra_indent + this.indent2 + `end\n`;
    return str;
  }

  add_outputs(outputs, extra_indent: string) {
    let str: string = "";
    for (let i = 0; i < outputs.length; ++i) {
      let output = outputs[i];
      output = output.trim();
      if (output[output.length - 1] !== ';') {
        output += ';';
      }
      str += extra_indent + this.indent3 + `${output}\n`;
    }
    return str;
  }

  generate_if_case(transitions, state_name: string, extra_indent: string) {
    let str: string = "";
    for (let i = 0; i < transitions.length; ++i) {
      if (i === 0) {
        str += extra_indent + this.indent3 + `if (${transitions[i].condition}) begin\n`;
        str += extra_indent + this.indent4 + `${state_name} = ${transitions[i].destination};\n`;
        str += extra_indent + this.indent3 + `end\n`;
      }
      else {
        str += extra_indent + this.indent3 + `else if (${transitions[i].condition}) begin\n`;
        str += extra_indent + this.indent4 + `${state_name} = ${transitions[i].destination};\n`;
        str += extra_indent + this.indent3 + `end\n`;
      }
    }
    return str;
  }

  open_process(clock_name: string) {
    let str: string = "";
    str += `always @(posedge ${clock_name}) begin\n`;
    return str;
  }

  close_process() {
    let str: string = "";
    str += "end\n";
    return str;
  }

  open_case(extra_indent: string) {
    let str: string = "";
    str += extra_indent + this.indent1 + "case(state)\n";
    return str;
  }
  close_case(extra_indent: string) {
    let str: string = "";
    str += extra_indent + this.indent1 + "endcase\n";
    return str;
  }
}
