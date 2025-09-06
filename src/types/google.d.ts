declare global {
  interface Window {
    gapi?: {
      load: (api: string, callback: () => void) => void;
      auth2: {
        init: (config: any) => Promise<any>;
        getAuthInstance: () => any;
      };
    };
    google?: {
      picker: {
        PickerBuilder: new () => any;
        DocsView: new () => any;
        Action: {
          PICKED: string;
        };
      };
    };
  }
}

export {};