
import { useState, useEffect } from "react";


function App() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [formData, setFormData] = useState({
    type: "Lost",
    name: "",
    description: "",
    location: "",
    contact: "",
    image:null
  });
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this item?"
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/items/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    fetchItems();
  } catch (error) {
    console.error(error);
    alert("Error deleting item");
  }
};

  const fetchItems = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/items"
      );

      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = new FormData();

    data.append("type", formData.type);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("contact", formData.contact);

    if (formData.image) {
      data.append("image", formData.image);
    }

    const response = await fetch(
      "http://localhost:5000/api/items",
      {
        method: "POST",
        body: data
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save item");
    }

    const savedItem = await response.json();

    setItems((prevItems) => [...prevItems, savedItem]);

    setFormData({
      type: "Lost",
      name: "",
      description: "",
      location: "",
      contact: "",
      image: null
    });

    alert("Item reported successfully!");

  } catch (error) {
    console.error("Error:", error);
    alert("Error reporting item");
  }
};
  const filteredItems = items.filter((item) => {
  const matchesSearch =
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase());

  const matchesType =
    filterType === "All" || item.type === filterType;

  return matchesSearch && matchesType;
});

  return (
    <div className="container">

      <div className="header">
        <h1>Lost & Found Portal</h1>
        <p>Report and find lost items on campus</p>
      </div>

      <div className="form-card">

        <h2>Report Lost / Found Item</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Type</label>

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          <div className="form-group">
            <label>Item Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: Black Wallet"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: College Library"
              required
            />
          </div>

          <div className="form-group">
            <label>Contact</label>

            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <label>Item Image</label>
          <input
             type="file"
             accept="image/*"
             onChange={(e) =>
             setFormData({
             ...formData,
            image: e.target.files[0]
           })
          }
          />
          <button type="submit">
            Report Item
          </button>

        </form>

      </div>

      <div className="items-section">
        <div className="search-section">

  <input
    type="text"
    placeholder="Search item or location..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={filterType}
    onChange={(e) => setFilterType(e.target.value)}
  >
    <option value="All">All Items</option>
    <option value="Lost">Lost Items</option>
    <option value="Found">Found Items</option>
  </select>

</div>

        <h2>Reported Items</h2>
        

        {filteredItems === 0 ? (
          <p>No items reported yet.</p>
        ) : (
          filteredItems.map((item) => (

            <div className="item-card" key={item._id}>
              {item.image && (
                 <>
                   <p>Image path: {item.image}</p>
                   <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="item-image"
                   />
                 </>
           )}

              <h3>{item.name}</h3>

              <p>
                <strong>Type:</strong>{" "}
                <span
                  className={
                    item.type === "Lost"
                      ? "type-lost"
                      : "type-found"
                  }
                >
                  {item.type}
                </span>
              </p>

              <p>
                <strong>Description:</strong>{" "}
                {item.description}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {item.location}
              </p>

              <p>
                <strong>Contact:</strong>{" "}
                {item.contact}
              </p>
              <div className="item-actions">
               <button onClick={() => handleDelete(item._id)}>
                 Delete
               </button>
              </div>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default App;
