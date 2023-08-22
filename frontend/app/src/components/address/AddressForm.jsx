import React, { useState } from "react";
import { useProductsContext } from "../../contexts";
import { v4 as uuid } from "uuid";

const AddressForm = ({ setShowAddressForm, editAddress, setEditAddress }) => {
  const { addAddress, setCurrentAddress, updateAddress } = useProductsContext();
  const [newAddress, setNewAddress] = useState(
    editAddress
      ? editAddress
      : {
          id: uuid(),
          fullname: "",
          mobile: "",
          flat: "",
          area: "",
          city: "",
          pincode: "",
        }
  );
  const submitHandler = (e) => {
    e.preventDefault();

    if (editAddress) {
      updateAddress(newAddress.id, newAddress);
    } else {
      addAddress(newAddress);
      setCurrentAddress(newAddress);
    }
    setShowAddressForm(false);
  };
  return (
    <form
      action=""
      className="flex flex-col gap-3 p-5 bg-gray-50 shadow-sm"
      onSubmit={submitHandler}
    >
      <div className="flex gap-2 flex-wrap">
        <label className="flex flex-1 flex-col">
          Nome completo
          <input
            required
            type="text"
            className="border rounded-md p-1.5 shadow-sm"
            onChange={(e) =>
              setNewAddress({ ...newAddress, fullname: e.target.value })
            }
            value={newAddress.fullname}
          />
        </label>
        <label className="flex flex-1 flex-col">
          Celular
          <input
            required
            type="number"
            className="border rounded-md p-1.5 shadow-sm"
            onChange={(e) =>
              setNewAddress({ ...newAddress, mobile: e.target.value })
            }
            value={newAddress.mobile}
          />
        </label>
      </div>
      <label className="flex flex-1 flex-col">
          Cep
          <input
            required
            type="number"
            className="border rounded-md p-1.5 shadow-sm"
            onChange={(e) =>
              setNewAddress({ ...newAddress, pincode: e.target.value })
            }
            value={newAddress.pincode}
          />
        </label>
      <label className="flex flex-col">
        Endereço
        <input
          required
          type="text"
          className="border rounded-md p-1.5 shadow-sm"
          onChange={(e) =>
            setNewAddress({ ...newAddress, area: e.target.value })
          }
          value={newAddress.area}
        />
      </label>
      <label className="flex flex-col">
        Complemento
        <input
          required
          type="text"
          className="border rounded-md p-1.5 shadow-sm"
          onChange={(e) =>
            setNewAddress({ ...newAddress, flat: e.target.value })
          }
          value={newAddress.flat}
        />
      </label>
      <div className="flex gap-2 flex-wrap">
        <label className="flex flex-1 flex-col">
          Cidade/Estado
          <input
            required
            type="text"
            className="border rounded-md p-1.5 shadow-sm"
            onChange={(e) =>
              setNewAddress({ ...newAddress, city: e.target.value })
            }
            value={newAddress.city}
          />
        </label>
      </div>

      <div className="flex gap-3 mt-3 flex-wrap">
        <button
          type="button"
          className="btn-rounded-secondary rounded-full flex items-center gap-2 text-sm"
          onClick={() => {
            setShowAddressForm(false);
            setNewAddress({
              fullname: "",
              mobile: "",
              flat: "",
              area: "",
              city: "",
              pincode: "",
            });
            if (editAddress) {
              setEditAddress(null);
            }
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-rounded-primary rounded-full flex items-center gap-2 text-sm"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
