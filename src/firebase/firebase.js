import { initializeApp } from "firebase/app";
import {
  getFirestore,
  getDocs,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
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

const getPetbyId = async (petId) => {
  try {
    const petDocRef = doc(db, "pets", petId); // สร้าง DocumentReference สำหรับสัตว์เลี้ยง
    const petDoc = await getDoc(petDocRef); // รอผลลัพธ์จากการดึงข้อมูลสัตว์เลี้ยง

    if (petDoc.exists()) {
      return petDoc.data(); // คืนค่าข้อมูลสัตว์เลี้ยง
    } else {
      console.error("No such pet document!"); // ถ้าเอกสารไม่พบ
      return null; // คืนค่า null ถ้าไม่มีเอกสาร
    }
  } catch (error) {
    console.error("Error fetching pet: ", error); // แสดงข้อผิดพลาด
    return null; // คืนค่า null ในกรณีที่เกิดข้อผิดพลาด
  }
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

const uploadImage = async (img, type) => {
  if (!img) {
    console.error("No image file provided");
    return null;
  }
  try {
    if (type === "doctor") {
      const storageRef = ref(storage, `doctorImages/${v4()}`); // สร้าง path โดยใช้ UUID
      const snapshot = await uploadBytes(storageRef, img); // อัปโหลดรูปภาพ
      const imageUrl = await getDownloadURL(snapshot.ref); // รับ URL ของรูปภาพที่อัปโหลด
      console.log("Image URL:", imageUrl); // ตรวจสอบ URL
      return imageUrl;
    }
    if (type === "vaccine") {
      const storageRef = ref(storage, `vaccineImages/${v4()}`); // สร้าง path โดยใช้ UUID
      const snapshot = await uploadBytes(storageRef, img); // อัปโหลดรูปภาพ
      const imageUrl = await getDownloadURL(snapshot.ref); // รับ URL ของรูปภาพที่อัปโหลด
      console.log("Image URL:", imageUrl); // ตรวจสอบ URL
      return imageUrl;
    }
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
  const type = "doctor";
  // อัปโหลดรูปภาพและรับ URL
  const uploadedImageUrl = await uploadImage(img, type);

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

const fetchedVaccine = async () => {
  const colRef = collection(db, "vaccine");
  const snapshot = await getDocs(colRef);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
};

const AddVaccine = async (newVaccine, img) => {
  if (!newVaccine || !newVaccine.name) {
    // ตรวจสอบให้แน่ใจว่ามี name และ img ถูกต้อง
    console.error("ไม่มีข้อมูลชื่อวัคซีน");
    return console.log("กรุณากรอกชื่อวัคซีน");
  }
  const type = "vaccine";

  if (!newVaccine.image) {
    console.error("ไม่มีรูปภาพ");
    return console.log("กรุณาอัพโหลดรูปภาพ");
  }

  // อัปโหลดรูปภาพและรับ URL
  const uploadedImageUrl = await uploadImage(newVaccine.image, type);

  const NewVaccine = {
    vaccineName: newVaccine.name, // ใช้ newVaccine.name แทน namevaccine
    vaccineImage: uploadedImageUrl, // URL รูปภาพที่อัปโหลด
  };

  try {
    const vaccineRef = collection(db, "vaccine");
    const docRef = await addDoc(vaccineRef, {
      ...NewVaccine,
      createdAt: new Date(),
    });
    console.log("Vaccine added with ID: ", docRef.id);
    return docRef;
  } catch (error) {
    console.error("Error adding vaccine: ", error);
    return null;
  }
};

const EditVaccine = async (vaccineId, updatedVaccine, img) => {
  try {
    // ตรวจสอบว่า updatedVaccine.vaccineName มีค่าหรือไม่ ถ้าไม่มีให้ใช้ชื่อเดิม
    const vaccineName = updatedVaccine.vaccineName || "ชื่อวัคซีนไม่ระบุ";

    // ใช้ URL ของรูปเดิมก่อน ถ้าไม่มีการเปลี่ยนรูปภาพ
    let uploadedImageUrl = updatedVaccine.vaccineImage;

    // อัปโหลดรูปภาพใหม่ถ้ามีการเปลี่ยนแปลง
    if (img) {
      const type = "vaccine";
      uploadedImageUrl = await uploadImage(img, type); // อัปโหลดรูปใหม่

      // ลบรูปภาพเก่าออกจาก Firebase Storage ถ้ารูปใหม่แตกต่างจากรูปเดิม
      if (updatedVaccine.vaccineImage) {
        const filePath = updatedVaccine.vaccineImage
          .split("/vaccineImages%2F")[1]
          ?.split("?")[0]; // แยก path รูปภาพที่ถูกต้องจาก URL

        if (filePath) {
          const storageRef = ref(
            storage,
            `vaccineImages/${decodeURIComponent(filePath)}`
          );
          await deleteObject(storageRef); // ลบรูปเก่าออก
        }
      }
    }

    const updatedData = {
      vaccineName,
      vaccineImage: uploadedImageUrl, // ใช้ URL รูปใหม่หรือรูปเดิม
    };

    // อัปเดตเอกสารใน Firestore
    const vaccineDocRef = doc(db, "vaccine", vaccineId);
    await updateDoc(vaccineDocRef, updatedData);

    console.log("Vaccine updated successfully.");
  } catch (error) {
    console.error("Error updating vaccine: ", error);
  }
};

const deleteVaccineInFirebase = async (vaccineId, imageUrl) => {
  try {
    // ลบเอกสารวัคซีนจาก Firestore
    const vaccineDocRef = doc(db, "vaccine", vaccineId);
    await deleteDoc(vaccineDocRef);

    // ตรวจสอบว่ามี imageUrl และไม่เป็น undefined
    if (imageUrl && typeof imageUrl === "string") {
      // แยกเอา path ของไฟล์ออกจาก URL โดยปกติ path คือหลัง `vaccineImages/`
      const filePath = imageUrl.split("/vaccineImages%2F")[1]?.split("?")[0]; // ตรวจสอบและแยกเอา path ที่ถูกต้อง
      if (filePath) {
        const storageRef = ref(
          storage,
          `vaccineImages/${decodeURIComponent(filePath)}`
        ); // ใช้ path ที่ถูกต้อง
        await deleteObject(storageRef); // ลบไฟล์จาก Storage
        console.log("Image deleted successfully from storage.");
      } else {
        console.warn("Image path is invalid or cannot be parsed.");
      }
    } else {
      console.warn("No valid image URL provided.");
    }

    console.log("Vaccine and associated image deleted successfully.");
  } catch (error) {
    console.error("Error deleting vaccine or image: ", error);
  }
};

const addNEwTreatment = async (petId, vaccineId, treatmentsdec, nextAppointmentDate) => {
  try {
    const petDocRef = doc(db, "pets", petId); // เอกสารสัตว์เลี้ยง
    const vaccineDocRef = doc(db, "vaccine", vaccineId); // เอกสารวัคซีน

    // ดึงข้อมูลวัคซีน
    const vaccineDoc = await getDoc(vaccineDocRef);

    if (vaccineDoc.exists()) {
      console.log("Vaccine Document:", vaccineDoc.data()); // แสดงข้อมูลวัคซีน

      // สร้างข้อมูลการรักษาใหม่
      const newTreatment = {
        vaccine: vaccineDoc.data(), // ใช้ข้อมูลวัคซีนที่ดึงมา
        description: treatmentsdec,
        nextAppointmentDate: nextAppointmentDate ? nextAppointmentDate : "ไม่มีการนัด",
        DateVaccination: new Date(), // สร้างวันที่
      };

      // อัปเดตเอกสารสัตว์เลี้ยง
      const updatedPetData = {
        historytreatments: arrayUnion(newTreatment),
      };


      await updateDoc(petDocRef, updatedPetData); // อัปเดตเอกสาร
      const doctorID = "HzQiVbpyy3ImR0JwuJOY"; // Correct doctor ID
      await addAppointmentInDoctor(petId, doctorID); // Pass petId (string) instead of petDocRef
      console.log("Pet document updated successfully");
    } else {
      console.error("No such vaccine document!"); // ถ้าเอกสารวัคซีนไม่พบ
    }
  } catch (error) {
    console.error("Error updating pet: ", error); // แสดงข้อผิดพลาด
  }
};

const addAppointmentInDoctor = async (petId, doctorID) => {
  console.log("petID", petId);
  console.log("doctorID", doctorID);


  try {
    const petDocRef = doc(db, "pets", petId); // เอกสารสัตว์เลี้ยง
    const doctorDocRef = doc(db, "doctorsVen", doctorID); // Corrected collection for doctors

    const GetDocpet = await getDoc(petDocRef); // Await to get the document
    const GetDoctor = await getDoc(doctorDocRef); // Await to get the doctor document

    console.log(GetDocpet.data().historytreatments.nextAppointmentDate)
    console.log(GetDoctor.data());

    const AddAppointMent = {
      pet: GetDocpet.data(),
      Doctor: GetDoctor.data(),
      // DateVaccination: GetDocpet.data().nextAppointmentDate,
      status: false
    };

    // Use addDoc for adding a document
    await addDoc(collection(db, "appointment"), AddAppointMent);
    console.log("Appointment added successfully");


  } catch (error) {
    console.error("Error updating pet: ", error); // แสดงข้อผิดพลาด
  }
};


export {
  AddOwnerToFirebase,
  addPetToFirebase,
  getPetbyId,
  AddVaccine,
  updatePetInFirebase,
  updateOwnerInFirebase,
  EditVaccine,
  deleteOwnerInFirebase,
  deletePetInFirebase,
  deleteVaccineInFirebase,
  fecthOwners,
  fetchedPets,
  fetchedDoctors,
  fetchedVaccine,
  addNewDoctors,
  addNEwTreatment,
  auth,
  db,
  storage,
};
