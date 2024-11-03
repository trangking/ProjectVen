import React, { useState, useEffect } from "react";
import {
  Tabs,
  Button,
  Form,
  Select,
  DatePicker,
  Modal,
  Table,
  Input,
  message,
  TimePicker,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  addNEwTreatment,
  fetchedPets,
  fetchedVaccine,
  upDateAppointment,
  fetchedDoctorsByID,
  fetchedAddPointMentBydoctorID,
} from "../../firebase/firebase";
import moment from "moment";
import dayjs from "dayjs";
import useStore from "../../store";

const { TabPane } = Tabs;
const { Option } = Select;

const Doctorpage = () => {
  const [openHistory, setOpenHistory] = useState(false);
  const [vaccineId, setVaccineId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [vaccine, setVaccine] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState([]);
  const [form] = Form.useForm();
  const [treatmentsdec, setTreatmentsdec] = useState("");
  const [nextAppointmentDate, setNextAppointmentDate] = useState(null);
  const [typeStatus, setTypeStatus] = useState("");
  const [apID, setapId] = useState("");
  const format = "HH:mm";
  const [selectedTime, setSelectedTime] = useState(dayjs());
  const [ownerId, setOwnerId] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const getID = localStorage.getItem("Id");
  const [doctor, setDoctor] = useState([]);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect if no token
    }
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      alert("Session expired. Please log in again.");
      navigate("/");
    }, 3600000);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  useEffect(() => {
    const loadData = async () => {
      const fetchedPet = await fetchedPets();
      setPets(fetchedPet);
      const fetchVaccine = await fetchedVaccine();
      setVaccine(fetchVaccine);
      const fetchappointment = await fetchedAddPointMentBydoctorID(getID);
      setAppointments(fetchappointment);
      setFilteredAppointments(fetchappointment);
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const fetchedDoctorByID = await fetchedDoctorsByID(getID);
      setDoctor(fetchedDoctorByID);
    };
    if (getID) loadData();
  }, [getID]);

  const showModal = (record) => {
    setTypeStatus("01");
    setSelectedPet(record);
    setIsModalVisible(true);
    setOwnerId(record.ownerId);
  };

  const showModaladdtreatment = (record) => {
    if (record.pet && record.pet.length > 0) {
      setSelectedPet(record.pet[0]);
    } else {
      console.log("No pet data found");
    }
    if (record.pet && record.owner.length > 0) {
      setOwnerId(record.owner[0].id);
    } else {
      console.log("No owner data found");
    }
    setapId(record.id);
    setTypeStatus("02");
    setIsModalVisible(true);
  };

  const showModalHistory = async (record) => {
    setSelectedPet(record);
    setOpenHistory(true);
  };

  const handleAddTreatment = async () => {
    if (!selectedPet.id || !vaccineId) {
      message.error(
        "Please fill out all fields: pet, vaccine, and treatment details."
      );
      return;
    }
    if (typeStatus === "02") {
      await upDateAppointment(apID);
    }
    await addNEwTreatment(
      selectedPet.id,
      vaccineId,
      treatmentsdec,
      nextAppointmentDate,
      selectedTime,
      ownerId,
      doctor.id
    );
    setIsModalVisible(false);
    message.success("Treatment added successfully.");
    setSelectedPet({});
    setVaccineId("");
    setTreatmentsdec("");
    setNextAppointmentDate(null);
    setSelectedTime(null);
    form.resetFields();
    handleCancel();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOpenHistory(false);
    setSelectedPet({});
    setVaccineId("");
    setTreatmentsdec("");
    setNextAppointmentDate(null);
    setSelectedTime(null);
    form.resetFields();
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    console.log(time.format("HH:mm"));
  };

  const handleDateSearch = (date) => {
    if (!date) {
      setFilteredAppointments(appointments);
      return;
    }

    const formattedDate = date.format("YYYY-MM-DD");
    console.log("Formatted search date:", formattedDate);

    const filtered = appointments.filter((appointment) => {
      console.log("Checking appointment:", appointment); // Log each appointment for inspection

      // Check if nextAppointmentDate exists
      if (appointment.nextAppointmentDate) {
        const appointmentDate = appointment.nextAppointmentDate;
        console.log("Appointment date:", appointmentDate);

        // Compare dates
        return appointmentDate === formattedDate;
      } else {
        console.log("nextAppointmentDate is missing for this appointment.");
        return false;
      }
    });

    setFilteredAppointments(filtered);
    console.log("Filtered appointments:", filtered); // Show the final filtered results
  };

  return (
    <div className="manage-doctor">
      <div className="header bg-yellow-500 text-white p-4 text-center mb-4">
        <h1 className="text-3xl font-bold">
          Doctor's Appointments: {doctor.DoctorName}
        </h1>
      </div>

      <div className="p-8">
        <Tabs defaultActiveKey="1">
          <TabPane tab="Appointments" key="1">
            <h2 className="text-2xl font-bold mb-4">
              Doctor's Appointment Schedule
            </h2>

            <Form layout="inline">
              <Form.Item name="date" label="Select Date">
                <DatePicker onChange={handleDateSearch} />
              </Form.Item>

              <Form.Item>
                <Link to={"/pageAdmin/Appointment"} target="blank">
                  <Button type="primary">Add Appointment</Button>
                </Link>
                <Link to={"/"} className=" ml-4">
                  <Button type="primary" onClick={logout}>
                    Logout
                  </Button>
                </Link>
              </Form.Item>
            </Form>

            <Table
              dataSource={filteredAppointments}
              columns={[
                {
                  title: "Appointment Date",
                  dataIndex: "nextAppointmentDate",
                  key: "nextAppointmentDate",
                },
                {
                  title: "Time",
                  dataIndex: "TimeAppoinMentDate",
                  key: "time",
                },
                {
                  title: "Pet Name",
                  dataIndex: ["pet", "0", "name"],
                  key: "petName",
                },
                {
                  title: "Details",
                  dataIndex: ["Latesttreatment", "description"],
                  key: "description",
                },
                {
                  title: "Appointment Status",
                  dataIndex: "confirmStats",
                  key: "confirmStats",
                  render: (confirmStats) =>
                    confirmStats === null
                      ? "Pending"
                      : confirmStats
                      ? "Confirmed"
                      : "Cancelled",
                },
                {
                  title: "Treatment Status",
                  dataIndex: "status",
                  key: "treatmentStatus",
                  render: (status) => (status ? "Completed" : "Pending"),
                },
                {
                  title: "Add Treatment",
                  render: (text, record) => (
                    <Button
                      disabled={record.status}
                      key={record.id}
                      onClick={() => showModaladdtreatment(record)}
                    >
                      Open
                    </Button>
                  ),
                  key: "addTreatment",
                },
              ]}
              rowKey={(record) => record.id || record.petId}
              className="mt-4"
            />
          </TabPane>

          <TabPane tab="Pets" key="2">
            <h2 className="text-2xl font-bold mb-4">Pet Information</h2>

            <Table
              dataSource={pets}
              columns={[
                { title: "Pet Name", dataIndex: "name", key: "name" },
                { title: "Type", dataIndex: "type", key: "type" },
                { title: "Age (Years)", dataIndex: "years", key: "years" },
                { title: "Age (Months)", dataIndex: "months", key: "months" },
                {
                  title: "View History",
                  key: "GetTreatment",
                  render: (text, record) => (
                    <Button onClick={() => showModalHistory(record)}>
                      Open
                    </Button>
                  ),
                },
                {
                  title: "Add Treatment",
                  key: "addTreatment",
                  render: (text, record) => (
                    <Button type="primary" onClick={() => showModal(record)}>
                      Add
                    </Button>
                  ),
                },
              ]}
              rowKey="name"
              className="mt-4"
            />
          </TabPane>
        </Tabs>

        <Modal
          title={`Add Treatment for ${selectedPet?.name}`}
          visible={isModalVisible}
          onOk={handleAddTreatment}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="vaccine"
              label="Vaccine"
              rules={[{ required: true, message: "Please select a vaccine" }]}
            >
              <Select
                placeholder="Select Vaccine"
                onChange={setVaccineId}
                value={vaccineId}
              >
                {vaccine.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.vaccineName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea
                onChange={(event) => setTreatmentsdec(event.target.value)}
                placeholder="Additional details"
                value={treatmentsdec}
              />
            </Form.Item>

            <Form.Item label="Next Appointment Date">
              <DatePicker
                defaultValue={
                  nextAppointmentDate ? moment(nextAppointmentDate) : null
                }
                onChange={(date, dateString) =>
                  setNextAppointmentDate(dateString)
                }
                style={{ width: "100%" }}
                placeholder="Select next appointment date"
              />
            </Form.Item>
            <Form.Item>
              <div className="flex flex-col">
                <label>Next Appointment Time</label>
                <TimePicker
                  className="mt-2"
                  format={format}
                  onChange={handleTimeChange}
                />
              </div>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={`Treatment History: ${selectedPet?.name}`}
          visible={openHistory}
          onCancel={handleCancel}
          footer={null}
          width={1000}
        >
          <div className="bg-pink-100 rounded-lg p-6">
            <table className="min-w-full table-auto border-collapse border border-pink-200">
              <thead>
                <tr className="bg-pink-200">
                  <th className="px-4 py-2 border border-pink-300">
                    Vaccination Against
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    Batch No.
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    Date of Vaccination
                  </th>
                  <th className="px-4 py-2 border border-pink-300">
                    Next Vaccination
                  </th>
                  <th className="px-4 py-2 border border-pink-300">Sticker</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedPet.historytreatments) &&
                selectedPet.historytreatments.length > 0 ? (
                  selectedPet.historytreatments.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.vaccine.vaccineName}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        <img
                          src={item.batchNo}
                          alt={`Batch No. ${index + 1}`}
                          className="w-12 h-12 object-contain"
                        />
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.DateVaccination}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        {item.nextAppointmentDate}
                      </td>
                      <td className="px-4 py-2 border border-pink-300">
                        <img
                          src={item.vaccine.vaccineImage}
                          alt={`Sticker for ${item.vaccine.vaccineImage}`}
                          className="w-12 h-12 object-contain"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No treatment history available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Doctorpage;
