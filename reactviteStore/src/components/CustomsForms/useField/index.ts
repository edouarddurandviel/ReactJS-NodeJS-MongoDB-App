import { useContext, useState, useEffect } from "react";
import { CustomsFormContext } from "../context";

export const useField = ({
  name,
  defaultValue,
  validations,
}: {
  name: string;
  defaultValue: string | (() => string);
  validations: any;
}) => {
  const form = useContext(CustomsFormContext);

  const [value, setValue] = useState<string>(defaultValue);
  const [error, setError] = useState(null);
  const [isTouched, setIsTouched] = useState(false);

  // Register field in form
  useEffect(() => {
    form.registerField(name, {
      value,
      setValue,
      validate,
    });

    return () => {
      form.unregisterField(name);
    };
  }, [name, value]);

  // Validation logic
  const validate = () => {
    for (let rule of validations) {
      const isValid = rule.rule(value);
      if (!isValid) {
        setError(rule.message);
        return false;
      }
    }
    setError(null);
    return true;
  };

  // When value changes → validate
  useEffect(() => {
    if (isTouched) {
      validate();
    }
  }, [value]);

  return {
    value,
    setValue: (val: any) => {
      setIsTouched(true);
      setValue(val);
    },
    error,
    isTouched,
    isValid: !error,
  };
};
