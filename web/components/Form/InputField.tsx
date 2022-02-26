import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import { FormGroup, FormLabel, FormControl } from "react-bootstrap";

type TInputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
};

const InputField: React.FunctionComponent<TInputFieldProps> = ({
  label,
  size: _,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  // True if field fails validation and only after user input
  const isInvalid = !!touched && !!error;
  // Capitalize first letter of field name
  const fieldTitle = field.name[0].toUpperCase() + field.name.substring(1);
  const controlId = `validateFormik${fieldTitle}`;

  return (
    <FormGroup controlId={controlId}>
      {label ? <FormLabel>{label}</FormLabel> : null}
      <FormControl isInvalid={isInvalid} {...field} {...props} />
      <FormControl.Feedback type="invalid">{error}</FormControl.Feedback>
    </FormGroup>
  );
};

export { InputField };
