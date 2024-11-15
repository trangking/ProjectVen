import { create } from "zustand";
import { message } from "antd";

const useStore = create((set) => ({
  firstName: "",
  setfirstName: (firstName) => set({ firstName: firstName }),

  lastnameOwner: "",
  setLastnameOwner: (lastname) => set({ lastnameOwner: lastname }),

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
    subType: "",
    years: "",
    months: "",
    weight: "",
    color: "",
    gender: "",
    pet_status: ""
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
    localStorage.clear()
    set({ token: "" }); // เคลียร์ token ใน zustand ด้วย
    message.success("ออกจากระบบสำเร็จ")
  },
}));

export default useStore;
