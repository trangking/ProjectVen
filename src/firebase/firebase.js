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
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

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
const storage = getStorage(app);
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
    return docRef.id;
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
  selectedPetId,
  owners,
  setOwners
) => {
  if (!addMember || !addEmailMember || !addPhoneMember || !selectedPetId)
    return;

  const newOwnerData = {
    name: addMember,
    contact: addEmailMember,
    phone: addPhoneMember,
    address: addAddressMember,
    petId: selectedPetId,
  };

  try {
    // Create a new user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      addEmailMember,
      addPhoneMember
    );
    const userId = userCredential.user.uid;

    await setDoc(doc(db, "owners", userId), newOwnerData);

    const petDocRef = doc(db, "pets", selectedPetId);
    await updateDoc(petDocRef, {
      ownerId: userId,
    });

    setOwners([...owners, { ...newOwnerData, id: userId }]);
    console.log("Owner added and pet updated successfully.");
  } catch (error) {
    console.error("Error adding owner:", error);
  }
};

// Update existing owner and change linked pet
const updateOwnerInFirebase = async (
  ownerId,
  updatedOwnerData,
  previousPetId,
  newPetId
) => {
  try {
    // อัปเดตข้อมูลเจ้าของในคอลเลกชัน "owners"
    const ownerDocRef = doc(db, "owners", ownerId);
    await updateDoc(ownerDocRef, updatedOwnerData);

    // ถ้า petId มีการเปลี่ยนแปลง ให้ลบ ownerId ออกจากสัตว์เลี้ยงเก่า
    if (previousPetId && previousPetId !== newPetId) {
      const oldPetDocRef = doc(db, "pets", previousPetId);
      await updateDoc(oldPetDocRef, { ownerId: null }); // ลบ ownerId จากสัตว์เลี้ยงเก่า
    }

    // เพิ่ม ownerId ลงในสัตว์เลี้ยงใหม่ (ถ้าเลือกสัตว์เลี้ยงใหม่)
    if (newPetId) {
      const newPetDocRef = doc(db, "pets", newPetId);
      await updateDoc(newPetDocRef, { ownerId }); // เพิ่ม ownerId ลงในสัตว์เลี้ยงใหม่
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
    const q = query(ownersRef, where("petId", "==", petId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      // ลบ petId จาก owners ที่เกี่ยวข้อง
      const batchPromises = snapshot.docs.map(async (ownerDoc) => {
        if (ownerDoc.exists() && ownerDoc.id) {
          const ownerDocRef = doc(db, "owners", ownerDoc.id); // ตรวจสอบให้แน่ใจว่า ownerDoc.id มีค่า
          await updateDoc(ownerDocRef, { petId: null }); // ลบ petId จากเอกสารเจ้าของ
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

const uploadImage = async (img) => {
  if (!img) {
    console.error("No image file provided");
    return null;
  }
  try {
    const storageRef = ref(storage, `doctorImages/${v4()}`); // สร้าง path โดยใช้ UUID
    const snapshot = await uploadBytes(storageRef, img); // อัปโหลดรูปภาพ
    const imageUrl = await getDownloadURL(snapshot.ref); // รับ URL ของรูปภาพที่อัปโหลด
    console.log("Image URL:", imageUrl); // ตรวจสอบ URL
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image: ", error);
    return null;
  }
};

const fetchedDoctors = async () => {
  const colRef = collection(db, "doctorsVen");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};

const addNewDoctors = async (newDoctor, img) => {
  if (!img) {
    console.error("No image file provided");
    return null;
  }

  // อัปโหลดรูปภาพและรับ URL
  const uploadedImageUrl = await uploadImage(img);

  const NewDoctors = {
    DoctorName: newDoctor.name,
    Specialty: newDoctor.specialty,
    EmailDoctor: newDoctor.email,
    PhoneDoctor: newDoctor.phone,
    Medical_license: uploadedImageUrl, // บันทึก URL ของรูปภาพ
  };

  try {
    console.log("New doctor data with image URL: ", NewDoctors); // ตรวจสอบข้อมูล
    const DoctorsRef = collection(db, "doctorsVen");
    const docRef = await addDoc(DoctorsRef, {
      ...NewDoctors,
      createdAt: new Date(),
    });
    return docRef;
  } catch (error) {
    console.error("Error adding doctor: ", error);
    return null;
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
  fetchedDoctors,
  addNewDoctors,
  auth,
  db,
  storage,
};
