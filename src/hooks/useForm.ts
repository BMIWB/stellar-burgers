import {
  useState,
  useCallback,
  ChangeEvent,
  Dispatch,
  SetStateAction
} from 'react';

export interface UseFormReturn<T> {
  values: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValues: (values: T) => void;
  resetForm: (newValues?: T) => void;
  getFieldProps: (fieldName: keyof T) => {
    value: T[keyof T];
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  };
  getFieldSetter: (fieldName: keyof T) => Dispatch<SetStateAction<T[keyof T]>>;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  const resetForm = useCallback(
    (newValues?: T) => {
      setValues(newValues || initialValues);
    },
    [initialValues]
  );

  const getFieldProps = useCallback(
    (fieldName: keyof T) => ({
      value: values[fieldName],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        setValues((prevValues) => ({
          ...prevValues,
          [fieldName]: event.target.value
        }));
      }
    }),
    [values]
  );

  const getFieldSetter = useCallback(
    (fieldName: keyof T) =>
      ((newValue: SetStateAction<T[keyof T]>) => {
        setValues((prevValues) => ({
          ...prevValues,
          [fieldName]:
            typeof newValue === 'function'
              ? (newValue as (prev: T[keyof T]) => T[keyof T])(
                  prevValues[fieldName]
                )
              : newValue
        }));
      }) as Dispatch<SetStateAction<T[keyof T]>>,
    []
  );

  return {
    values,
    handleChange,
    setValues,
    resetForm,
    getFieldProps,
    getFieldSetter
  };
}
