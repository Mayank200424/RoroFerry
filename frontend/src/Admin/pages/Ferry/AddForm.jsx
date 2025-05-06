import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddFerryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    ferryCode: "",
    status: "active",
    classes: [
      {
        name: "",
        price: "",
        seats: [{ seatNumber: "", isBooked: false }],
      },
    ],
    categories: [
      { name: "", price: "" },
    ],

  });

  const classOptions = ["Executive", "Sleeper", "Business", "Room"];
  const categoryOptions = ["Passenger", "Car", "Bike", "Bus"];
  const navigate = useNavigate();

  const handleChange = (e, index, seatIndex, type) => {
    const { name, value } = e.target;
    const updatedData = [...formData[type]];

    if (seatIndex !== undefined) {
      updatedData[index].seats[seatIndex][name] = value;
    } else {
      updatedData[index][name] = value;
    }
    setFormData({ ...formData, [type]: updatedData });
  };

  const addClass = () => {
    setFormData({
      ...formData,
      classes: [...formData.classes, { name: "", price: "", seats: [{ seatNumber: "", isBooked: false }] }],
    });
  };

  const addSeat = (index) => {
    const updatedClasses = [...formData.classes];
    updatedClasses[index].seats.push({ seatNumber: "", isBooked: false });
    setFormData({ ...formData, classes: updatedClasses });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { name: "", price: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/add-ferries", formData, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Ferry added successfully!");

      setTimeout(() => {
        navigate("/admin/ship"); 
      }, 1500); 

      console.log(response.data);
    } catch (error) {
      console.error("Error adding ferry:", error.response?.data || error.message);
      toast.error("Error adding ferry");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Ship</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold">Ferry Name</label>
            <input type="text" name="name" className="w-full p-2 border rounded" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <label className="block font-semibold">Ferry Code</label>
            <input type="text" name="ferryCode" className="w-full p-2 border rounded" value={formData.ferryCode} onChange={(e) => setFormData({ ...formData, ferryCode: e.target.value })} required />
          </div>
        </div>
        
        {formData.classes.map((ferryClass, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <label className="block font-semibold">Class</label>
            <select name="name" className="w-full p-2 border mb-2 rounded" value={ferryClass.name} onChange={(e) => handleChange(e, index, undefined, 'classes')} required>
              <option value="">Select Class</option>
              {classOptions.map((className, i) => (
                <option key={i} value={className}>{className}</option>
              ))}
            </select>
            <label className="block font-semibold">Price</label>
            <input type="number" name="price" className="w-full p-2 border mb-2 rounded" value={ferryClass.price} onChange={(e) => handleChange(e, index, undefined, 'classes')} required />
            {ferryClass.seats.map((seat, seatIndex) => (
              <div key={seatIndex} className="ml-4 mb-2">
                <label className="block font-semibold">Seat Number</label>
                <input type="text" name="seatNumber" className="w-full p-2 border rounded" value={seat.seatNumber} onChange={(e) => handleChange(e, index, seatIndex, 'classes')} required />
              </div>
            ))}
            <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => addSeat(index)}>+ Add Seat</button>
          </div>
        ))}
        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={addClass}>+ Add Class</button>
        
        {formData.categories.map((category, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <label className="block font-semibold">Category</label>
            <select name="name" className="w-full p-2 border mb-2 rounded" value={category.name} onChange={(e) => handleChange(e, index, undefined, 'categories')} required>
              <option value="">Select Category</option>
              {categoryOptions.map((categoryName, i) => (
                <option key={i} value={categoryName}>{categoryName}</option>
              ))}
            </select>
            <label className="block font-semibold">Price</label>
            <input type="number" name="price" className="w-full p-2 border rounded" value={category.price} onChange={(e) => handleChange(e, index, undefined, 'categories')} required />
          </div>
        ))}
        <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={addCategory}>+ Add Category</button>
        
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">Submit</button>
      </form>
    </div>
  );
};

export default AddFerryForm;
