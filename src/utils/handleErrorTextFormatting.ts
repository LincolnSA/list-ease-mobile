interface ErrorTextFormattingDto {
  message: string;
}

export function handleErrorTextFormatting(input: ErrorTextFormattingDto): string {
  const { message } = input;
  const messageType = "Required";

  if (message !== messageType) {
    return message;
  };

  return "Campo obrigatório";
}