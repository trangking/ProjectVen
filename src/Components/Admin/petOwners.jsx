import React, { useState } from "react";

export default function PetOwners() {
  const [pets, setPets] = useState([
    { name: "Buddy", type: "Dog", age: 2 },
    { name: "Whiskers", type: "Cat", age: 3 },
  ]);
  const [newPet, setNewPet] = useState({ name: "", type: "", age: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (index = null) => {
    if (index !== null) {
      setNewPet(pets[index]);
      setEditIndex(index);
    } else {
      setNewPet({ name: "", type: "", age: "" });
      setEditIndex(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewPet({ name: "", type: "", age: "" });
  };

  const handleAddOrUpdatePet = () => {
    if (!newPet.name || !newPet.type || !newPet.age) return;

    if (editIndex !== null) {
      const updatedPets = [...pets];
      updatedPets[editIndex] = newPet;
      setPets(updatedPets);
    } else {
      setPets([...pets, newPet]);
    }
    closeModal();
  };

  const handleDeletePet = (index) => {
    const updatedPets = pets.filter((_, i) => i !== index);
    setPets(updatedPets);
  };

  return (
    <>
      <div className="w-full h-screen shadow-xl p-10 flex flex-col">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Manage Your Pets
        </h1>

        {/* Add New Pet Button */}
        <div className="flex justify-end mb-8">
          <button
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 px-6 rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-600 transition-transform transform hover:scale-105"
            onClick={() => openModal()}
          >
            + Add New Pet
          </button>
        </div>

        {/* Table to Display Pets */}
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-indigo-500 text-white rounded-t-lg">
            <tr>
              <th className="py-4 px-6 font-semibold text-left">Name</th>
              <th className="py-4 px-6 font-semibold text-left">Type</th>
              <th className="py-4 px-6 font-semibold text-left">Age</th>
              <th className="py-4 px-6 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet, index) => (
              <tr
                key={index}
                className="border-b bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <td className="py-4 px-6">{pet.name}</td>
                <td className="py-4 px-6">{pet.type}</td>
                <td className="py-4 px-6">{pet.age}</td>
                <td className="py-4 px-6">
                  <button
                    className="text-indigo-500 hover:text-indigo-600 mr-4 font-medium"
                    onClick={() => openModal(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600 font-medium"
                    onClick={() => handleDeletePet(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white w-full max-w-lg p-10 rounded-2xl shadow-2xl relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              {editIndex !== null ? "Edit Pet" : "Add New Pet"}
            </h2>

            <div className="space-y-6">
              <input
                type="text"
                placeholder="Pet Name"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newPet.name}
                onChange={(e) => setNewPet({ ...newPet, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Pet Type (e.g., Dog, Cat)"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newPet.type}
                onChange={(e) => setNewPet({ ...newPet, type: e.target.value })}
              />
              <input
                type="number"
                placeholder="Pet Age"
                className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newPet.age}
                onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
              />
            </div>

            <div className="mt-8 flex justify-between">
              <button
                className="bg-indigo-500 text-white py-3 px-8 rounded-full hover:bg-indigo-600 transition-all"
                onClick={handleAddOrUpdatePet}
              >
                {editIndex !== null ? "Update Pet" : "Add Pet"}
              </button>
              <button
                className="bg-red-500 text-white py-3 px-8 rounded-full hover:bg-red-600 transition-all"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
