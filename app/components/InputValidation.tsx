import { useField } from "remix-validated-form";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface Props {
  name: string;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
}

export function InputValidation({
  name,
  label,
  defaultValue,
  placeholder,
}: Props) {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      {label ? <Label htmlFor={name}>{label}</Label> : <></>}
      <Input
        {...getInputProps({ id: name })}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
      {error ? (
        <Alert className="text-red-500">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <></>
      )}
    </div>
  );
}
