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
  Timestamp,
  arrayRemove
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
  apiKey: "AIzaSyCB_tQwjnuTKgla0sZwnu_Q__zYYiOPBRE",
  authDomain: "appointmentanimals.firebaseapp.com",
  projectId: "appointmentanimals",
  storageBucket: "appointmentanimals.appspot.com",
  messagingSenderId: "1050401290587",
  appId: "1:1050401290587:web:334811bfbd2c1fae3e427e",
  measurementId: "G-CTX071QNLL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Fetch pets from Firebase
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

    console.log("Owner added and pets updated successfully.");
  } catch (error) {
    console.error("Error adding owner and updating pets:", error);
  }
};

const AddOwner = async (
  addMember,
  addEmailMember,
  addPhoneMember,
  addAddressMember,
  addPassword,
  selectedPetIds, // Multiple pet selection
) => {
  // ตรวจสอบว่าไม่ได้ปล่อยให้ฟิลด์ที่จำเป็นว่างเปล่า
  // if (!addMember || !addEmailMember || !addPhoneMember || selectedPetIds.length === 0)
  //   return;
  try {
    // สร้างข้อมูลเจ้าของใหม่

    const newOwnerData = {
      name: addMember,
      password: addPassword,
      contact: addEmailMember,
      phone: addPhoneMember,
      address: addAddressMember,
      petIds: selectedPetIds, // เก็บ ID สัตว์เลี้ยงหลายตัว
    };

    // เพิ่มเจ้าของใหม่ในคอลเล็กชัน owners
    const ownerRef = await addDoc(collection(db, "owners"), newOwnerData);
    const updatePetPromises = selectedPetIds.map(async (petId) => {
      const petDocRef = doc(db, "pets", petId);
      await updateDoc(petDocRef, {
        ownerId: ownerRef.id,
      });
    });
    await Promise.all(updatePetPromises);
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
    Password: newDoctor.password,
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

const addNEwTreatment = async (petId, vaccineId, treatmentsdec, nextAppointmentDate, selectedTime, ownerId) => {
  try {
    const petDocRef = doc(db, "pets", petId); // เอกสารสัตว์เลี้ยง
    const vaccineDocRef = doc(db, "vaccine", vaccineId); // เอกสารวัคซีน

    // ดึงข้อมูลวัคซีน
    const vaccineDoc = await getDoc(vaccineDocRef);

    if (vaccineDoc.exists()) {
      console.log("Vaccine Document:", vaccineDoc.data()); // แสดงข้อมูลวัคซีน

      // สร้างข้อมูลการรักษาใหม่
      const convenDatae = new Date();
      const formattedDate = `${convenDatae.getFullYear()}-${(convenDatae.getMonth() + 1).toString().padStart(2, '0')}-${convenDatae.getDate().toString().padStart(2, '0')}`;
      const timeNextAppointment = new Date(selectedTime); // แปลง selectedTime เป็น Date

      // ดึงเฉพาะเวลา (ชั่วโมง:นาที) จาก Date
      const hours = timeNextAppointment.getHours();
      const minutes = timeNextAppointment.getMinutes();

      // รูปแบบเวลาเป็น "HH:MM"
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      // แปลง Day.js เป็น Firebase Timestamp

      const newTreatment = {
        vaccine: vaccineDoc.data(), // ใช้ข้อมูลวัคซีนที่ดึงมา
        description: treatmentsdec,
        nextAppointmentDate: nextAppointmentDate ? nextAppointmentDate : "ไม่มีการนัด",
        nextTimeAppoinMentDate: formattedTime ? formattedTime : "ไม่มีเวลาการนัด",
        DateVaccination: formattedDate, // สร้างวันที่
      };

      // อัปเดตเอกสารสัตว์เลี้ยงใน Firestore
      const updatedPetData = {
        historytreatments: arrayUnion(newTreatment),
      };
      await updateDoc(petDocRef, updatedPetData);

      console.log("Pet document updated successfully");

      // ถ้ามีการนัดหมายครั้งถัดไป ให้เพิ่มการนัดหมายใหม่
      if (nextAppointmentDate) {
        const doctorID = "JrNzgZuvB6gl78MxjmIG"; // ใส่ doctorID ที่ถูกต้อง
        await addAppointmentInDoctor(petId, doctorID, formattedTime, ownerId); // Pass petId (string) instead of petDocRef
      }

    } else {
      console.error("No such vaccine document!"); // ถ้าเอกสารวัคซีนไม่พบ
    }
  } catch (error) {
    console.error("ไม่สามารถอัพโหลดได้ ", error); // แสดงข้อผิดพลาด
  }
};


const addAppointmentInDoctor = async (petId, doctorID, formattedTime, ownerId) => {
  console.log("petID", petId);
  console.log("doctorID", doctorID);
  console.log("ownerID", ownerId);
  try {
    const petDocRef = doc(db, "pets", petId); // เอกสารสัตว์เลี้ยง
    const doctorDocRef = doc(db, "doctorsVen", doctorID); // เอกสารแพทย์
    const ownerDocRef = doc(db, "owners", ownerId); // เอกสารเจ้าของ


    // ดึงข้อมูลสัตว์เลี้ยงและแพทย์
    const GetDocpet = await getDoc(petDocRef);
    const GetDoctor = await getDoc(doctorDocRef);
    const GetDocOwner = await getDoc(ownerDocRef)
    // ตรวจสอบว่าข้อมูลของสัตว์เลี้ยงและแพทย์มีอยู่
    const petData = GetDocpet.data();
    const doctorData = GetDoctor.data();
    const ownerData = GetDocOwner.data();

    if (!petData || !doctorData || !ownerData) {
      console.error("Pet or doctor data not found.");
      return;
    }

    // ตรวจสอบว่า historytreatments เป็น array และมีข้อมูล
    const historytreatments = petData.historytreatments;
    if (!Array.isArray(historytreatments) || historytreatments.length === 0) {
      console.error("No history treatments found for this pet.");
      return;
    }
    // เข้าถึงรายการล่าสุดใน historytreatments
    const latestTreatment = historytreatments[historytreatments.length - 1];
    // ตรวจสอบว่ามี nextAppointmentDate หรือไม่ในรายการล่าสุด
    const nextAppointmentDate = latestTreatment.nextAppointmentDate || "N/A";
    const pets = {
      id: GetDocpet.id,
      name: petData.name,
    }
    const owners = {
      id: GetDocOwner.id,
      name: ownerData.name,
      phone: ownerData.phone
    }
    // สร้างข้อมูลการนัดหมายใหม่
    const AddAppointMent = {
      owner: arrayUnion(owners),
      pet: arrayUnion(pets),
      Latesttreatment: latestTreatment, // ข้อมูลการรักษาล่าสุดของสัตว์เลี้ยง
      doctorID: GetDoctor.id, // ใช้ .id จาก GetDoctor สำหรับไอดีเอกสารแพทย์
      doctorName: doctorData.DoctorName || "Unknown Doctor", // ตรวจสอบว่ามีชื่อแพทย์ในข้อมูลหรือไม่
      nextAppointmentDate,
      TimeAppoinMentDate: formattedTime,
      status: false, // สถานะการนัดหมาย
    };

    const docRef = await addDoc(collection(db, "appointment"), AddAppointMent);
    console.log("Appointment added successfully");
    return docRef.id;

  } catch (error) {
    console.error("Error adding appointment: ", error); // แสดงข้อผิดพลาด
  }
};


const addAppointmentInAdmin = async (AddAppointment) => {
  console.log("obj", AddAppointment);
  try {
    const petDocRef = doc(db, "pets", AddAppointment.petId); // เอกสารสัตว์เลี้ยง
    const doctorDocRef = doc(db, "doctorsVen", AddAppointment.doctorID); // เอกสารแพทย์
    const ownerDocRef = doc(db, "owners", AddAppointment.ownerId); // เอกสารเจ้าของ


    // ดึงข้อมูลสัตว์เลี้ยงและแพทย์
    const GetDocpet = await getDoc(petDocRef);
    const GetDoctor = await getDoc(doctorDocRef);
    const GetDocOwner = await getDoc(ownerDocRef)
    // ตรวจสอบว่าข้อมูลของสัตว์เลี้ยงและแพทย์มีอยู่
    const petData = GetDocpet.data();
    const doctorData = GetDoctor.data();
    const ownerData = GetDocOwner.data();

    if (!petData || !doctorData || !ownerData) {
      console.error("Pet or doctor data not found.");
      return;
    }

    // ตรวจสอบว่า historytreatments เป็น array และมีข้อมูล
    const historytreatments = petData.historytreatments;
    if (!Array.isArray(historytreatments) || historytreatments.length === 0) {
      console.error("No history treatments found for this pet.");
      return;
    }
    // เข้าถึงรายการล่าสุดใน historytreatments
    const latestTreatment = historytreatments[historytreatments.length - 1];
    // ตรวจสอบว่ามี nextAppointmentDate หรือไม่ในรายการล่าสุด
    const pets = {
      id: GetDocpet.id,
      name: petData.name,
    }
    const owners = {
      id: GetDocOwner.id,
      name: ownerData.name,
      phone: ownerData.phone
    }
    // สร้างข้อมูลการนัดหมายใหม่
    const AddAppointMent = {
      owner: arrayUnion(owners),
      pet: arrayUnion(pets),
      Latesttreatment: latestTreatment, // ข้อมูลการรักษาล่าสุดของสัตว์เลี้ยง
      doctorID: GetDoctor.id, // ใช้ .id จาก GetDoctor สำหรับไอดีเอกสารแพทย์
      doctorName: doctorData.DoctorName || "Unknown Doctor", // ตรวจสอบว่ามีชื่อแพทย์ในข้อมูลหรือไม่
      nextAppointmentDate: AddAppointment.nextAppointmentDate,
      TimeAppoinMentDate: AddAppointment.selectedTime,
      status: false, // สถานะการนัดหมาย
    };

    const docRef = await addDoc(collection(db, "appointment"), AddAppointMent);
    console.log("Appointment added successfully");
    return docRef.id;

  } catch (error) {
    console.error("Error adding appointment: ", error); // แสดงข้อผิดพลาด
  }
};

const upDateAppointment = async (apID) => {
  try {
    const apRef = doc(db, "appointment", apID)
    await updateDoc(apRef, {
      status: true
    })
  } catch (error) {
    console.error("Error updating document: ", error); // แสดงข้อผิดพลาดถ้ามี
  }

}

const fetchedAddPointMent = async () => {
  try {
    const colRef = collection(db, "appointment");
    const snapshot = await getDocs(colRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.log(error, "ไม่พบข้อมูล");

  }
}

const GetAddPointMentBytrue = async () => {
  try {
    const colRef = collection(db, "appointment");
    const q = query(colRef, where("status", "==", true))
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.log(error, "ไม่พบข้อมูล");

  }
}

const GetAddPointMentByfalse = async () => {
  try {
    const colRef = collection(db, "appointment");
    const q = query(colRef, where("status", "==", false))
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data;
  } catch (error) {
    console.log(error, "ไม่พบข้อมูล");
  }
}

const getOwnerByIdpet = async (ownerId) => {
  try {
    const docRef = doc(db, "owners", ownerId); // Reference to the document by ID
    const getData = await getDoc(docRef);

    if (getData.exists()) {
      const ownerData = getData.data(); // Retrieve the document data
      console.log(ownerData);
      return ownerData; // Return the owner data
    } else {
      console.log("ไม่พบข้อมูล"); // Log if no document is found
      return null; // Return null or handle as needed
    }

  } catch (error) {
    console.log(error, "ไม่พบข้อมูล");
    return null; // Return null or handle error as needed
  }
};




export {
  AddOwnerToFirebase,
  AddOwner,
  addPetToFirebase,
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
  fetchedAddPointMent,
  addNewDoctors,
  addNEwTreatment,
  upDateAppointment,
  GetAddPointMentBytrue,
  GetAddPointMentByfalse,
  getOwnerByIdpet,
  addAppointmentInAdmin,
  auth,
  db,
  storage,
};
