import React from "react";

// ข้อมูลตัวอย่างของสัตว์เลี้ยง
const pets = [
  {
    id: 1,
    name: "Buddy",
    type: "Dog",
    age: 5,

    imgSrc: "",
  },
  {
    id: 2,
    name: "Mittens",
    type: "Cat",
    age: 3,

    imgSrc: "",
  },
  {
    id: 3,
    name: "Goldie",
    type: "Fish",
    age: 1,

    imgSrc: "",
  }, // ไม่มีรูป
  {
    id: 4,
    name: "Chirpy",
    type: "Bird",
    age: 2,

    imgSrc: "",
  }, // ไม่มีรูป
];

// การ์ดแสดงข้อมูลสัตว์เลี้ยง
export default function PetCards() {
  const defaultImg = "/image/default.png"; // รูปภาพ default ที่ใช้เมื่อไม่มีรูปสัตว์เลี้ยง

  const handleAddPet = () => {
    alert("คุณต้องการเพิ่มสัตว์เลี้ยงใหม่!"); // ปุ่มคลิกเพิ่มสัตว์เลี้ยง
  };

  return (
    <div className="container mx-auto mt-8">
      {/* หัวข้อของหน้า */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">รายการสัตว์เลี้ยง</h2>
        <button
          onClick={handleAddPet}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-300"
        >
          เพิ่มสัตว์เลี้ยง +
        </button>
      </div>

      {/* การ์ดสัตว์เลี้ยง */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${pet.imgSrc ? pet.imgSrc : defaultImg})`,
              backgroundSize: "60% 90%",
              backgroundPosition: "center",
              height: "250px", // ความสูงของการ์ด
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="bg-black bg-opacity-50 p-6 h-full flex flex-col justify-end">
              <h3 className="text-2xl font-semibold mb-2">{pet.name}</h3>
              <p className="text-gray-300">ประเภท: {pet.type}</p>
              <p className="text-gray-300">อายุ: {pet.age} ปี</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
