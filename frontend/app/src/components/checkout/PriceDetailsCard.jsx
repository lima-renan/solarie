const PriceDetailsCard = ({
  totalItems,
  actualPriceOfCart,
  totalPriceOfCartProducts,
}) => {
  const summaryData = [
    { label: "Total de Produtos", value: totalItems },
    {
      label: "Subtotal",
      value: `R$${actualPriceOfCart}`,
    },
    {
      label: "Desconto",
      value: `-R$${actualPriceOfCart - totalPriceOfCartProducts}`,
    },
    {
      label: "Frete",
      value: "Grátis",
    },
  ];

  return summaryData.map(({ label, value }) => (
    <div key={label} className=" flex justify-between items-center p-0 ">
      <p className=" text-gray-600">{label}</p>
      <p className="text-lg">{value}</p>
    </div>
  ));
};
export default PriceDetailsCard;
