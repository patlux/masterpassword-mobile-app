export interface IMpwAppCliConfigFile {
  export: {
    format: number;
    redacted: boolean;
    date: string;
  };
  user: {
    avatar: number;
    full_name: string;
    last_used: string;
    key_id: string;
    algorithm: number;
    default_type: number;
  };
  sites: {
    [key: string]: IMpwAppCliConfigSite;
  };
}

export interface IMpwAppCliConfigSite {
  type: number;
  counter: number;
  algorithm: number;
  login_type: number;
  uses: number;
  last_used: string;
  questions: any;
  _ext_mpw: any;
}

export function parse(str: string): IMpwAppCliConfigFile | null {
  let obj: any;
  try {
    obj = JSON.parse(str);
  } catch (exception) {
    return null;
  }

  if (obj.export && obj.user && obj.sites) {
    return obj as IMpwAppCliConfigFile;
  }

  return null;
}
