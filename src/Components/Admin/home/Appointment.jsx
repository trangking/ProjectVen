import React, { useState } from "react";

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    hn: "",
    petName: "",
    ownerName: "",
    doctorName: "",
    phoneNumber: "",
    appointmentTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("ข้อมูลที่ถูกส่ง:", formData);
  };

  return (
    <div className="flex flex-row w-full h-[80vh] bg-gray-100">
      {/* Form Section */}
      <div className="min-h-auto flex w-1/2 bg-white p-8 rounded-l-2xl">
        <div className="w-full max-w-lg mx-auto flex flex-col justify-center">
          <h1 className="text-5xl font-bold text-center mb-8 text-teal-600">
            นัดหมายสัตว์เลี้ยง
          </h1>

          {/* Form */}
          <form
            onSubmit={handleFormSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
          >
            {/* HN */}
            <div>
              <label className="block text-gray-700 font-semibold">HN</label>
              <input
                type="text"
                name="hn"
                value={formData.hn}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="กรอก HN"
              />
            </div>

            {/* Pet Name */}
            <div>
              <label className="block text-gray-700 font-semibold">
                ชื่อสัตว์เลี้ยง
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="กรอกชื่อสัตว์เลี้ยง"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-gray-700 font-semibold">
                ลูกค้า
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="กรอกชื่อลูกค้า"
              />
            </div>

            {/* Doctor Name */}
            <div>
              <label className="block text-gray-700 font-semibold">
                ชื่อแพทย์
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="กรอกชื่อแพทย์"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-semibold">
                เบอร์โทร
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                placeholder="กรอกเบอร์โทร"
              />
            </div>

            {/* Appointment Time */}
            <div>
              <label className="block text-gray-700 font-semibold">
                เวลานัดหมาย
              </label>
              <input
                type="datetime-local"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                className="w-full mt-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 flex w-full justify-center mt-6">
              <button
                type="submit"
                className="w-1/2 bg-teal-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-teal-400 transition"
              >
                ยืนยันนัดหมาย
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-1/2 h-auto ">
        <img
          src="/image/vet.webp"
          alt="Veterinarian and Pet"
          className="object-cover w-full h-full rounded-r-2xl"
        />
      </div>
    </div>
  );
}
