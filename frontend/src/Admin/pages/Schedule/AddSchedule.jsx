import { useState, useEffect } from "react";
import { FaShip, FaCalendarAlt, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddSchedule = () => {
  const [formData, setFormData] = useState({
    ferryName: "",
    from: "",
    to: "",
    departureDate: "",
    arrivalTime: "",
    tripType: "one-way",
    returnDate: "",
    returnTime: "",
  });

  const [ferries, setFerries] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFerries = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/ferries");
        const data = await response.json();
        if (response.ok) {
          setFerries(data.data);
        } else {
          console.error("Error fetching ferries:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchFerries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dataToSend = { ...formData };

    if (formData.tripType === "one-way") {
      delete dataToSend.returnDate;
      delete dataToSend.returnTime;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/add-schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
  
      const data = await response.json();
      if (response.ok) {
        toast.success("Schedule added successfully!");

        setTimeout(() => {
          navigate("/admin/schedule"); 
        }, 1500); 
     
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Add Ship Schedule
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border p-3 rounded-lg">
            <FaShip className="text-gray-500 mr-2" />
            <select
              name="ferryName"
              value={formData.ferryName}
              onChange={handleChange}
              required
              className="w-full outline-none bg-transparent"
            >
              <option value="">Select Ferry</option>
              {ferries.map((ferry) => (
                <option key={ferry._id} value={ferry.name}>
                  {ferry.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="From"
              className="border p-3 rounded-lg w-full outline-none"
              required
            />
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="To"
              className="border p-3 rounded-lg w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border p-3 rounded-lg">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              min={today}
              className="w-full outline-none bg-transparent"
              required
            />
          </div>

          <div className="flex items-center border p-3 rounded-lg">
            <FaClock className="text-gray-500 mr-2" />
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium">Trip Type:</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tripType"
                  value="one-way"
                  checked={formData.tripType === "one-way"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-500"
                />
                <span>One-Way</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tripType"
                  value="round-trip"
                  checked={formData.tripType === "round-trip"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Round-Trip</span>
              </label>
            </div>
          </div>

          {formData.tripType === "round-trip" && (
            <>
              <div className="flex items-center border p-3 rounded-lg">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  min={formData.departureDate || today}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                  required
                />
              </div>
              <div className="flex items-center border p-3 rounded-lg">
                <FaClock className="text-gray-500 mr-2" />
                <input
                  type="time"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-700 transition-all"
          >
            Add Schedule
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSchedule;