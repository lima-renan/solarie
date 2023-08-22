import { toast } from "react-toastify";

// Função para verificar se a data é válida
export const isValidDate = (day, month, year) => {
  // Convertendo os valores para números inteiros
  day = parseInt(day, 10);
  month = parseInt(month, 10);
  year = parseInt(year, 10);

  // Verificar se os valores são numéricos
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return false;
  }

  // Verificar se os valores estão dentro dos limites
  if (year < 1900 || year > 2023 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  // Verificar o limite de dias para cada mês
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Verificar se é um ano bissexto e atualizar o limite de dias de fevereiro
  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[1] = 29;
  }

  return day <= daysInMonth[month - 1];
};

export const notify = (type, message, delay) => {
  if (type === "success") {
    toast.success(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  } else if (type === "error") {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  } else if (type === "warn") {
    toast.warn(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  } else {
    toast.info(message, {
      position: toast.POSITION.BOTTOM_CENTER,
      delay,
    });
  }
};
