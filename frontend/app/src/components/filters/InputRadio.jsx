import React from "react";
import { useProductsContext } from "../../contexts";

const InputRadio = ({ data, name }) => {
  const {
    applyFilters,
    filters: { rating },
  } = useProductsContext();

  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        className="accent-current cursor-pointer"
        name={name}
        value={data}
        onChange={(e) => applyFilters(name, data)}
        checked={data === rating}
      />{" "}
      {data} Estrela(s) ou mais
    </label>
  );
};

export default InputRadio;
