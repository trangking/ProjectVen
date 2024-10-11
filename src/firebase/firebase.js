import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where, arrayRemove
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDt4hJzCGHCP2Hp8lQ7Xoxexv7qauYgu-A",
  authDomain: "appointmentven.firebaseapp.com",
  projectId: "appointmentven",
  storageBucket: "appointmentven.appspot.com",
  messagingSenderId: "1084978936005",
  appId: "1:1084978936005:web:df525fd313432244a358ac",
  measurementId: "G-KGC3LCBM55",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Fetch owners from Firebase
const fecthOwners = async () => {
  const colRef = collection(db, "owners");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};

// Fetch pets from Firebase
const fetchedPets = async () => {
  const colRef = collection(db, "pets");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};

// Add pet to Firebase
const addPetToFirebase = async (pet) => {
  try {
    const docRef = await addDoc(collection(db, "pets"), {
      ...pet,
      createdAt: new Date(),
    });
    return docRef.id; // คืนค่า id ของสัตว์เลี้ยงที่สร้างขึ้น
  } catch (error) {
    console.error("Error adding pet: ", error);
    return null;
  }
};

// Update pet in Firebase
const updatePetInFirebase = async (petId, updatedPetData) => {
  try {
    const petDocRef = doc(db, "pets", petId);
    await updateDoc(petDocRef, updatedPetData);
  } catch (error) {
    console.error("Error updating pet: ", error);
  }
};

// Add owner to Firebase
const AddOwnerToFirebase = async (
  addMember,
  addEmailMember,
  addPhoneMember,
  addAddressMember,
  selectedPetIds, // Multiple pet selection
  owners,
  setOwners
) => {
  if (!addMember || !addEmailMember || !addPhoneMember || selectedPetIds.length === 0)
    return;

  const newOwnerData = {
    name: addMember,
    contact: addEmailMember,
    phone: addPhoneMember,
    address: addAddressMember,
    petIds: selectedPetIds, // Store multiple pet IDs
  };
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      addEmailMember,
      addPhoneMember
    );
    const userId = userCredential.user.uid;
    await setDoc(doc(db, "owners", userId), newOwnerData);
    const updatePetPromises = selectedPetIds.map(async (petId) => {
      const petDocRef = doc(db, "pets", petId);
      await updateDoc(petDocRef, {
        ownerId: userId,
      });
    });
    await Promise.all(updatePetPromises);
    setOwners([...owners, { ...newOwnerData, id: userId }]);
    console.log("Owner added and pets updated successfully.");
  } catch (error) {
    console.error("Error adding owner and updating pets:", error);
  }
};

// Update existing owner and change linked pet
const updateOwnerInFirebase = async (ownerId, updatedOwnerData, previousPetIds, newPetIds) => {
  try {
    // ตรวจสอบว่า ownerId เป็น string และมีค่า
    if (!ownerId || typeof ownerId !== 'string') {
      throw new Error('Invalid ownerId');
    }

    // อัปเดตข้อมูลเจ้าของใน Firestore
    const ownerDocRef = doc(db, "owners", ownerId);
    await updateDoc(ownerDocRef, updatedOwnerData);

    // ตรวจสอบการเปลี่ยนแปลงของ petIds และทำการอัปเดตใน Firestore
    const petsRef = collection(db, "pets");

    // ลบ ownerId ออกจากสัตว์เลี้ยงเก่าที่ไม่ได้อยู่ใน newPetIds อีกต่อไป
    for (const petId of previousPetIds) {
      if (!newPetIds.includes(petId)) {
        const petDocRef = doc(petsRef, petId);
        await updateDoc(petDocRef, { ownerId: null });
      }
    }

    // เพิ่ม ownerId ในสัตว์เลี้ยงใหม่ที่ยังไม่มี ownerId
    for (const petId of newPetIds) {
      if (!previousPetIds.includes(petId)) {
        const petDocRef = doc(petsRef, petId);
        await updateDoc(petDocRef, { ownerId: ownerId });
      }
    }

    console.log("Owner and pets updated successfully.");
  } catch (error) {
    console.error("Error updating owner or pets:", error);
  }
};


const deleteOwnerInFirebase = async (ownerId) => {
  try {
    // Delete the owner from the "owners" collection
    const ownerDocRef = doc(db, "owners", ownerId);
    await deleteDoc(ownerDocRef);

    // Update the pets collection by removing the ownerId from all associated pets
    const petsRef = collection(db, "pets");
    const q = query(petsRef, where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);

    const batchPromises = snapshot.docs.map(async (petDoc) => {
      const petDocRef = doc(db, "pets", petDoc.id);
      await updateDoc(petDocRef, { ownerId: null });
    });

    await Promise.all(batchPromises);

    // If the owner is currently authenticated, delete their account
    const user = auth.currentUser;
    if (user && user.uid === ownerId) {
      await deleteUser(user); // Delete the user from Firebase Authentication
    }

    console.log("Owner and associated pets deleted successfully.");
  } catch (error) {
    console.error("Error deleting owner or updating pets:", error);
  }
};

const deletePetInFirebase = async (petId) => {
  try {
    // ตรวจสอบว่า petId เป็น string ที่ถูกต้อง
    if (!petId || typeof petId !== "string") {
      throw new Error("Invalid petId");
    }

    // ลบสัตว์เลี้ยงจากคอลเลกชัน "pets"
    const petDocRef = doc(db, "pets", petId);
    await deleteDoc(petDocRef);

    // หาว่า pet นี้เกี่ยวข้องกับ owner ไหนบ้าง
    const ownersRef = collection(db, "owners");
    const q = query(ownersRef, where("petIds", "array-contains", petId)); // ตรวจสอบว่า petId อยู่ใน array หรือไม่
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // ลบ petId จาก owners ที่เกี่ยวข้อง
      const batchPromises = snapshot.docs.map(async (ownerDoc) => {
        if (ownerDoc.exists() && ownerDoc.id) {
          const ownerDocRef = doc(db, "owners", ownerDoc.id);
          await updateDoc(ownerDocRef, { petIds: arrayRemove(petId) }); // ใช้ arrayRemove เพื่อลบ petId ออกจาก array
        } else {
          console.error("Invalid owner document or missing owner id");
        }
      });

      await Promise.all(batchPromises);
    }

    console.log("Pet and associated petId in owners deleted successfully.");
  } catch (error) {
    console.error("Error deleting pet or updating owners:", error.message);
  }
};

export {
  AddOwnerToFirebase,
  addPetToFirebase,
  updatePetInFirebase,
  updateOwnerInFirebase,
  deleteOwnerInFirebase,
  deletePetInFirebase,
  fecthOwners,
  fetchedPets,
  auth,
  db,
};
