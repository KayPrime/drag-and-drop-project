//  Validatble interface
export interface Validatable {
  data: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

// Validator function
export function validator(input: Validatable) {
  let isValid: boolean = true;
  if (input.required && input.data !== null) {
    isValid = isValid && input.data.toString().trim().length !== 0;
  }
  if (input.minLength && typeof input.data === "string") {
    isValid = isValid && input.data.trim().length >= input.minLength;
  }
  if (input.maxLength && typeof input.data === "string") {
    isValid = isValid && input.data.trim().length <= input.maxLength;
  }
  if (input.minValue && typeof input.data === "number") {
    isValid = isValid && input.data >= input.minValue;
  }
  if (input.maxValue && typeof input.data === "number") {
    isValid = isValid && input.data <= input.maxValue;
  }
  return isValid;
}
