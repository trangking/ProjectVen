import { create } from "zustand";

const useStore = create((set) => ({
  addMember: "",
  setAddMember: (newMember) => set({ addMember: newMember }),

  addEmailMember: "",
  setEmailMember: (EmailMember) => set({ addEmailMember: EmailMember }),

  addPassword: "",
  setAddPassword: (newPassword) => set({ addPassword: newPassword }),

  addPhoneMember: "",
  setPhoneMember: (PhoneMember) => set({ addPhoneMember: PhoneMember }),

  addAddressMember: "",
  setAddressMember: (AddressMember) => set({ addAddressMember: AddressMember }),

  newPet: {
    name: "",
    type: "",
    subTypeExsotic: "",
    years: "",
    months: "",
    weight: "",
    color: "",
    gender: "",
  },
  setNewPet: (pet) => set({ newPet: pet }),

  resetNewPet: () =>
    set({
      newPet: {
        name: "",
        type: "",
        subType: "",
        years: "",
        months: "",
        weight: "",
        color: "",
        gender: "",
      },
    }),

  email: "",
  password: "",
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),

  token: "",
  setToken: (token) => set({ token }),

  Owners: [],
  setOwners: (Owners) => set({ Owners }),

  pets: [],
  setPets: (pets) => set({ pets }),

  // ฟังก์ชันสำหรับออกจากระบบ
  logout: () => {
    localStorage.removeItem("Id");
    localStorage.removeItem("token");
    set({ token: "" }); // เคลียร์ token ใน zustand ด้วย
    console.log("Logged out successfully");
  },
}));

export default useStore;
