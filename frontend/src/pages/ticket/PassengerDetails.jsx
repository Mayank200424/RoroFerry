import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCar, FaMotorcycle, FaUser, FaBus, FaPhone } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    ferry,
    selectedCategory,
    selectedSeatsByClass, 
    totalAmount,
  } = location.state || {};

  const [contactNumber, setContactNumber] = useState("");
  const [proofType, setProofType] = useState("Aadhaar");
  const [proofNumber, setProofNumber] = useState("");
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState(
    Array.isArray(selectedCategory)
      ? selectedCategory
          .filter(cat => cat.name !== "Passenger")
          .map(() => ({
            vehicleName: "",
            vehicleNumber: "",
            weight: "",
            isNew: false,
          }))
      : []
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [contactError, setContactError] = useState("");
  const [proofError, setProofError] = useState("");

  const categoryIcons = {
    Car: <FaCar className="text-gray-600 text-lg" />,
    Bike: <FaMotorcycle className="text-gray-600 text-lg" />,
    Bus: <FaBus className="text-gray-600 text-lg" />,
  };

  const validationPatterns = {
    Aadhaar: /^\d{12}$/,
    Passport: /^[A-Z]{1}[0-9]{7}$/,
    'Driving License': /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,15}$/
  };

 
  useEffect(() => {
    if (!location.state) {
      navigate("/ticket", { replace: true });
      return;
    }

    const initialPassengerDetails = Object.entries(selectedSeatsByClass || {}).flatMap(([className, seatIds]) =>
      seatIds.map(() => ({
        firstName: "",
        lastName: "",
        gender: "",
        age: "",
        className,
      }))
    );
    setPassengerDetails(initialPassengerDetails);
  }, [location.state, navigate, selectedSeatsByClass]);

  const handlePassengerChange = (index, field, value) => {
    setPassengerDetails((prevDetails) =>
      prevDetails.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      )
    );
  };

  const handleVehicleChange = (index, field, value) => {
    setVehicleDetails((prevDetails) =>
      prevDetails.map((vehicle, i) =>
        i === index ? { ...vehicle, [field]: value } : vehicle
      )
    );
  };

  const validateContactNumber = (number) => {
    const phonePattern = /^[6-9]\d{9}$/;
    if (!number) {
      return "Contact number is required";
    }
    if (!phonePattern.test(number)) {
      return "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9";
    }
    return "";
  };

  const validateProofNumber = (number, type) => {
    if (!number) {
      return "Proof number is required";
    }
    if (!validationPatterns[type].test(number)) {
      switch (type) {
        case "Aadhaar":
          return "Aadhaar must be a 12-digit number";
        case "Passport":
          return "Passport must start with a letter followed by 7 digits";
        case "Driving License":
          return "Enter a valid driving license number";
        default:
          return "Invalid proof number format";
      }
    }
    return "";
  };

  const handleBooking = async () => {
    setErrorMsg("");
    setContactError("");
    setProofError("");

    const contactValidationError = validateContactNumber(contactNumber);
    if (contactValidationError) {
      setContactError(contactValidationError);
      toast.error(contactValidationError);
      return;
    }

    
    const proofValidationError = validateProofNumber(proofNumber, proofType);
    if (proofValidationError) {
      setProofError(proofValidationError);
      toast.error(proofValidationError);
      return;
    }

    if (
      passengerDetails.length > 0 &&
      passengerDetails.some((p) => !p.firstName || !p.lastName || !p.gender || !p.age)
    ) {
      toast.error("Please fill all passenger details.");
      return;
    }

    if (
      vehicleDetails.length > 0 &&
      vehicleDetails.some((v) => !v.vehicleName || !v.vehicleNumber || !v.weight)
    ) {
      toast.error("Please fill all vehicle details.");
      return;
    }

    setLoading(true);
    try {
      let passengerIndex = 0;
      const bookings = Object.entries(selectedSeatsByClass).flatMap(([className, seatIds]) => {
        const classData = ferry.classes.find((cls) => cls.name === className);

        return seatIds.map((seatId) => {
          const seat = classData?.seats.find((s) => s._id === seatId);
          const seatNumber = seat?.seatNumber || "";
          const passenger = passengerDetails[passengerIndex];

          const booking = {
            ferryId: ferry._id,
            className,
            seatNumber,
            category: selectedCategory.map((cat) => cat.name),
            passengers: passenger ? [passenger] : [],
            vehicles: vehicleDetails,
            contactNumber,
            proofType,
            proofNumber,
            totalAmount,
          };

          passengerIndex++;
          return booking;
        });
      });

      for (const booking of bookings) {
        const response = await axios.post("http://localhost:5000/api/book-seat", booking);
      
        if (response.data && response.data.message !== "Booking successful") {
          toast.error(`Error for seat ${booking.seatNumber}: ${response.data.error}`);
          setLoading(false);
          return;
        }
      }

      localStorage.setItem("pendingBookings", JSON.stringify(bookings));

      const paymentRes = await axios.post("http://localhost:5000/api/checkout", {
        amount: totalAmount,
        description: "Ro-Ro Ferry Ticket Booking",
      });

      if (paymentRes.data.url) {
        window.location.href = paymentRes.data.url;
      } else {
        toast.error("Payment initiation failed.");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(error.response?.data?.error || "Failed to process booking.");
    }
    setLoading(false);
  };

  const seatsByClass = Object.entries(selectedSeatsByClass || {}).map(([className, seatIds]) => ({
    className,
    seatIds,
    seats: ferry?.classes
      .find((cls) => cls.name === className)
      ?.seats.filter((seat) => seatIds.includes(seat._id)) || [],
  }));

  return (
    <div className="flex gap-6 p-6 bg-gray-100 mt-20">
      <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Passenger Details</h2>

        {seatsByClass.length > 0 && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="text-lg font-semibold">Passenger(s)</h3>
            <p className="text-blue-600 text-sm font-semibold">
              Enter your name as per government-approved ID.
            </p>

            {seatsByClass.map((classData, classIndex) => (
              <div key={classData.className} className="mt-4">
                {classData.seatIds.map((seatId, seatIndex) => {
                  const passengerIndex = seatsByClass
                    .slice(0, classIndex)
                    .reduce((acc, cls) => acc + cls.seatIds.length, 0) + seatIndex;
                  const seat = classData.seats.find((s) => s._id === seatId);
                  return (
                    <div
                      key={seatId}
                      className="grid grid-cols-6 gap-2 items-center mt-4 bg-gray-100 p-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <FaUser className="text-gray-600 text-lg" />
                        <span className="bg-gray-200 px-3 py-2 rounded-md text-sm">
                          Passenger {classIndex + 1}
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="First Name"
                        className="border p-2 rounded-md text-sm"
                        value={passengerDetails[passengerIndex]?.firstName || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "firstName", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="border p-2 rounded-md text-sm"
                        value={passengerDetails[passengerIndex]?.lastName || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "lastName", e.target.value)
                        }
                      />
                      <select
                        className="border p-2 rounded-md text-sm"
                        value={passengerDetails[passengerIndex]?.gender || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "gender", e.target.value)
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Age"
                        className="border p-2 rounded-md text-sm w-16"
                        value={passengerDetails[passengerIndex]?.age || ""}
                        onChange={(e) =>
                          handlePassengerChange(passengerIndex, "age", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        value={classData.className}
                        className="border p-2 rounded-md text-sm bg-gray-200"
                        readOnly
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {Array.isArray(selectedCategory) &&
          selectedCategory.some((cat) => cat.name !== "Passenger") && (
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-semibold">Vehicle(s)</h3>
              <span className="text-blue-600 text-sm font-semibold">
                Important:{" "}
                <span className="text-gray-600">
                  Enter vehicle details as per government-approved ID.
                </span>
              </span>

              <div className="grid grid-cols-4 bg-gray-100 p-2 mt-3 text-sm font-semibold text-gray-700">
                <span>Vehicle Type</span>
                <span>Vehicle Name</span>
                <span>Vehicle Number</span>
                <span>Weight</span>
              </div>

              {selectedCategory
                .filter((cat) => cat.name !== "Passenger")
                .map((category, index) => (
                  <div
                    key={category.name}
                    className="grid grid-cols-4 gap-2 items-center mt-2"
                  >
                    <div className="flex items-center gap-2">
                      {categoryIcons[category.name]}
                      <span className="bg-gray-200 px-3 py-2 rounded-md text-sm">
                        {category.name}
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Vehicle Name (ex: Honda)"
                      className="border p-2 rounded-md text-sm w-full"
                      value={vehicleDetails[index]?.vehicleName || ""}
                      onChange={(e) =>
                        handleVehicleChange(index, "vehicleName", e.target.value)
                      }
                    />
                    <input
                      type="text"
                      placeholder="Hint: AA00BB1234"
                      className="border p-2 rounded-md text-sm w-full"
                      value={vehicleDetails[index]?.vehicleNumber || ""}
                      onChange={(e) =>
                        handleVehicleChange(index, "vehicleNumber", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="0"
                      className="border p-2 rounded-md text-sm w-16"
                      value={vehicleDetails[index]?.weight || ""}
                      onChange={(e) =>
                        handleVehicleChange(index, "weight", e.target.value)
                      }
                    />
                    <label className="flex items-center gap-2 col-span-4 mt-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={vehicleDetails[index]?.isNew || false}
                        onChange={(e) =>
                          handleVehicleChange(index, "isNew", e.target.checked)
                        }
                      />
                      <span className="text-sm text-gray-700">New Vehicle?</span>
                    </label>
                  </div>
                ))}
            </div>
          )}

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Proof Detail(s)</h3>
          <span className="text-blue-600 text-sm font-semibold">
            Important:{" "}
            <span className="text-gray-600">
              Enter details as per government-approved.
            </span>
          </span>

          <div className="grid grid-cols-2 gap-2 items-center mt-3">
            <select
              className="border p-2 rounded-md text-sm"
              value={proofType}
              onChange={(e) => {
                setProofType(e.target.value);
                setProofNumber("");
                setProofError("");
              }}
            >
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
              <option value="Driving License">Driving License</option>
            </select>

            <div>
              <input
                type="text"
                placeholder={
                  proofType === "Passport"
                    ? "Enter Passport Number"
                    : proofType === "Driving License"
                      ? "Enter License Number"
                      : "Enter Aadhaar Number"
                }
                className={`border p-2 rounded-md text-sm w-full ${proofError ? 'border-red-500' : ''}`}
                value={proofNumber}
                onChange={(e) => {
                  setProofNumber(e.target.value);
                  setProofError(validateProofNumber(e.target.value, proofType));
                }}
              />
              {proofError && <p className="text-red-500 text-xs mt-1">{proofError}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 border rounded-lg p-4">
          <h3 className="text-lg font-semibold">Contact Detail(s)</h3>
          <span className="text-blue-600 text-sm font-semibold">
            Important:{" "}
            <span className="text-gray-600">
              Booking transaction-related notifications will be sent to this
              number.
            </span>
          </span>

          <div className="flex items-center gap-2 mt-3">
            <FaPhone className="text-gray-600 text-lg" />
            <div className="w-full">
              <input
                type="text"
                placeholder="Enter Contact No"
                className={`border p-2 rounded-md text-sm w-full ${contactError ? 'border-red-500' : ''}`}
                value={contactNumber}
                onChange={(e) => {
                  setContactNumber(e.target.value);
                  setContactError(validateContactNumber(e.target.value));
                }}
                maxLength={10}
              />
              {contactError && <p className="text-red-500 text-xs mt-1">{contactError}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Fare Summary</h3>

        <div className="border-t mt-3 pt-3">
          <p className="text-md font-semibold">Departure:</p>
          <div className="flex justify-between text-gray-700 text-sm mt-2">
            <span>Base Fare</span>{" "}
            <span className="font-semibold">₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-gray-700 text-sm">
            <span>Other Services</span>{" "}
            <span className="font-semibold">₹0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-md mt-2">
            <span>Sub Total:</span>{" "}
            <span className="text-red-500">₹{totalAmount}</span>
          </div>
        </div>

        <button
          onClick={handleBooking}
          className="w-full bg-orange-500 text-white text-lg font-semibold py-2 mt-4 rounded-md"
          disabled={loading}
        >
          {loading ? "Processing..." : "BOOK NOW"}
        </button>
        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default BookingForm;