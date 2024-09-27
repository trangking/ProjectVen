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

  email: "",
  password: "",
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
}));

export default useStore;
