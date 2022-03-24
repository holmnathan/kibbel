import React, { InputHTMLAttributes } from "react";
import { Button, Spinner, SpinnerProps } from "react-bootstrap";

type TButtonProps = InputHTMLAttributes<HTMLButtonElement> & {
  isSpinning: boolean;
  spinner: SpinnerProps;
};

const SubmitButton: React.FunctionComponent<TButtonProps> = ({
  children,
  isSpinning,
  spinner,
  ...props
}) => {
  return (
    <Button type="submit">
      {isSpinning ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        ></Spinner>
      ) : null}
      {children}
    </Button>
  );
};

export { SubmitButton };
