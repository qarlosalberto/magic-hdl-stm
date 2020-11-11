/* eslint-disable @typescript-eslint/class-name-casing */
export function get_hdl_code(language: string, type: string, stm): string {
  let stm_hdl: string = "";
  if (language === "vhdl") {
    let stm_vhdl = new Vhdl_code();
    stm_hdl = stm_vhdl.get_vhdl_code(type, stm);
  }
  return stm_hdl;
}


class Vhdl_code {
  private indent: string = "  ";
  private indent2: string = this.indent + this.indent;
  private indent3: string = this.indent2 + this.indent;
  private indent4: string = this.indent3 + this.indent;


  get_vhdl_code(type: string, stm): string {
    let stm_hdl: string = "";
    if (type === "one_shot") {
      stm_hdl = this.get_vhdl_one_shot(stm);

    }
    return stm_hdl;
  }

  get_vhdl_one_shot(stm): string {
    let stm_hdl: string = "";
    stm_hdl += this.open_proccess();
    stm_hdl += this.open_case();
    for (let i = 0; i < stm.length; ++i) {
      stm_hdl += this.open_when(stm[i].name);
      stm_hdl += this.generate_if_case(stm[i].transitions);
    }
    stm_hdl += this.close_case();
    stm_hdl += this.close_proccess();
    return stm_hdl;
  }

  open_when(state_name: string) {
    let str: string = "";
    str += this.indent2 + `when ${state_name} =>\n`;
    return str;
  }

  generate_if_case(transitions) {
    let str: string = "";
    for (let i = 0; i < transitions.length; ++i) {
      if (i === 0) {
        str += this.indent3 + `if (${transitions[i].condition}) then\n`;
        str += this.indent4 + `STATE <= ${transitions[i].destination}\n`;
      }
      else {
        str += this.indent3 + `elsif (${transitions[i].condition}) then\n`;
        str += this.indent4 + `STATE <= ${transitions[i].destination}\n`;
      }
    }
    str += this.indent3 + "end if;\n";
    return str;
  }

  open_proccess() {
    let str: string = "";
    str += "proccess(clk)\nbegin\n";
    return str;
  }

  close_proccess() {
    let str: string = "";
    str += "end proccess;\n";
    return str;
  }

  open_case() {
    let str: string = "";
    str += this.indent + "case STATE is\n";
    return str;
  }
  close_case() {
    let str: string = "";
    str += this.indent + "case STATE is\n";
    return str;
  }
}






