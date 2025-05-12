import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const PRODUCTS = [
  { id: 1, name: "Vikas T-Shirt", price: 400 },
  { id: 2, name: "Web Codder Hoodie", price: 600 },
  { id: 3, name: "Developer Mug", price: 200 },
];

const Pay = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    email: "",
    phone: "",
    amount: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData((prev) => ({ ...prev, amount: product.price.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return alert("Please select a product");

    const txnid = `TN-${uuidv4()}`;

    const data = {
      ...formData,
      txnid,
      productinfo: JSON.stringify(selectedProduct),
    };

    try {
      const result = await axios.post(
        "http://localhost:3000/initiate-payment",
        data,
        {
          headers: { "Content-Type": "application/json" },
          responseType: "text/html",
        }
      );

      console.log(result.data);

      // Inject and submit the form safely
      const container = document.createElement("div");
      container.innerHTML = result.data;
      document.body.appendChild(container);

      const form = container.querySelector("form");
      if (form) form.submit();
      else alert("Payment form not found");
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Payment initiation failed");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Select a Product</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductSelect(product)}
            style={{
              border:
                selectedProduct?.id === product.id
                  ? "2px solid blue"
                  : "1px solid gray",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            <h4>{product.name}</h4>
            <p>₹{product.price}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px",
        }}
      >
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={(e) =>
            setFormData({ ...formData, firstname: e.target.value })
          }
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Your Email"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Phone Number"
          required
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            backgroundColor: "blue",
            color: "white",
          }}
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default Pay;
