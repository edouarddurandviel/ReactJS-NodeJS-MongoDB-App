// State manager
export type CreateFormStore = {
  fields: Map<any, any>;
  registerField: (name: any, field: any) => void;
  unregisterField: (name: any) => void;
  getValues: () => void;
  validate: () => void;
};

export const createFormStore = (): CreateFormStore => {
  const fields = new Map();

  return {
    fields,

    registerField(name: any, field: any) {
      fields.set(name, field);
    },

    unregisterField(name: any) {
      fields.delete(name);
    },

    getValues() {
      const values = {} as unknown as any;
      fields.forEach((field, name) => {
        values[name] = field.value;
      });
      return values;
    },

    validate() {
      let isValid = true;
      fields.forEach((field) => {
        if (!field.validate()) {
          isValid = false;
        }
      });
      return isValid;
    },
  };
};
