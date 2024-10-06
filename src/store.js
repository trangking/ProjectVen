import { create } from "zustand";

const useStore = create((set) => ({
  addMember: "",
  setAddMember: (newMember) => set({ addMember: newMember }),

  addEmailMember: "",
  setEmailMember: (EmailMember) => set({ addEmailMember: EmailMember }),

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
}));

export default useStore;
