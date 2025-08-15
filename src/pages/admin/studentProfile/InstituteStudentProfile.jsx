import Navbar from "../../../components/admin/Navbar";
import CustomButton from "../../../components/admin/CustomButton";
import CustomTypography from "../../../components/admin/CustomTypography";
import CustomTable from "../../../components/admin/CustomTable";
import CustomTextField from "../../../components/admin/CustomTextField";
import { apiGet,  apiPost } from "../../../api/axios";
import { snackbarEmitter } from "../../../components/admin/CustomSnackbar";
import { getAdminRoutePrefix } from "../../../utils/RoutePrefix";

function AdminStudentProfile() {
  const [openModal, setOpenModal] = useState(false);
  const routePrefix = getAdminRoutePrefix();

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false);
    setFormData({});
    setFormErrs({});
    setIsEditMode(false);
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    address: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formErrs, setFormErrs] = useState({});

  const handleErrors = () => {
    const errs = {};
    if (!formData.firstName) errs.firstName = "First name is required";
    if (!formData.lastName) errs.lastName = "Last name is required";
    if (!formData.email) errs.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.phone) errs.phone = "Phone number is required";
    if (!formData.gender) errs.gender = "Gender is required";
    if (!formData.password) errs.password = "Password is required";
    if (!formData.address) errs.address = "Address is required";
    setFormErrs(errs);
    return errs;
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      password: "",
      address: "",
    });
  };

  const handleSubmit = async () => {
    const errors = handleErrors();
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiPost(`/addInstituteStudent`, formData);

      setTimeout(() => {
        if (response.data.status === 200) {
          setLoading(false);
          snackbarEmitter(response.data.message, "success");
          handleModalClose();
          handleReset();
        } else {
          snackbarEmitter(response.data.message, "error");
        }
        getStudents();
      }, 500);
    } catch (error) {
      snackbarEmitter("Something went wrong", "error");
    }
  };

  const updateStudent = async (editingStudentId) => {
    setLoading(true);
    try {
      const response = await apiPost("/updateInstituteStudent", {
        id: editingStudentId,
        ...formData,
      });
       setTimeout(() => {
        if (response.data.status === 200) {
          setLoading(false);
          snackbarEmitter(response.data.message, "success");
          handleModalClose();
          handleReset();
        } else {
          snackbarEmitter(response.data.message, "error");
        }
        getStudents();
      }, 500);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const [students, setStudents] = useState([]);

  const getStudents = async () => {
    try {
      const response = await apiGet("/getAllInstituteStudents");
      console.log("Fetched students:", response.data.data);
      if (response.status === 200) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      snackbarEmitter("Something went wrong", "error");
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);

  const handleEdit = (student) => {
    setIsEditMode(true);
    console.log("Editing student:", student);
    setEditingStudentId(student._id);
    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      gender: student.gender || "",
      password: student.password || "",
      address: student.address || "",
    });
    console.log("Form data set for edit:", formData);
    setOpenModal(true);
  };

  const tableHeaders = [
    "Sr No",
    "First Name",
    "Last Name",
    "Gender",
    "Phone",
    "Status",
    "Action",
  ];

  const tableData = students.map((student) => ({
    row: [
      <Box onClick={() => handleClick(student)} sx={{ cursor: "pointer" }}>
        {student.firstName}
      </Box>,
      <Box onClick={() => handleClick(student)} sx={{ cursor: "pointer" }}>
        {student.lastName}
      </Box>,
      <Box onClick={() => handleClick(student)} sx={{ cursor: "pointer" }}>
        {student.gender}
      </Box>,
      <Box onClick={() => handleClick(student)} sx={{ cursor: "pointer" }}>
        {student.phone}
      </Box>,
      <Box onClick={() => handleClick(student)} sx={{ cursor: "pointer" }}>
        {"Active"}
      </Box>,

      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(student);
        }}
      >
        <img
          src="/images/edit.svg"
          alt="Edit"
          style={{ width: 20, height: 20 }}
        />
      </IconButton>,
    ],
  }));

  const navigate = useNavigate();

  const handleClick = (student) => {
    navigate(`${routePrefix}/studentPerformance`, {
      state: { student: student },
    });
  };

  const handleGeneratePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
    const password = Array.from(
      { length: 10 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");

    setFormData((prev) => ({ ...prev, password }));
    console.log("Generated password:", password);
  };


  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    formGrid: {
      display: "flex",
      gap: 2,
      mb: 3,
      justifyContent: { md: "center", xs: "left" },
    },
    generateButton: {
      position: "absolute",
      right: 0,
      top: "15%",
      transform: "translateY(-50%)",
      color: "#109CF1",
      textTransform: "none",
      textDecoration: "underline",
      minWidth: "auto",
      padding: 0,
      fontFamily: "Jost",
      fontWeight: 400,
      fontStyle: "normal",
      fontSize: "14px",
    },
  };

  return (
    <>
      <Grid container sx={styles.container} size={{ xs: 12, sm: 12, md: 12 }}>
        <Grid size={{ xs: 6, sm: 6, md: 6 }}>
          <CustomTypography
            text="Students"
            fontWeight={500}
            fontSize={{ xs: "18px", md: "22px", sm: "20px" }}
          />
        </Grid>
        <Grid>
          <CustomButton
            children="+ Add student"
            onClick={handleModalOpen}
            loading={false}
            bgColor="#EAB308"
            sx={{
              width: { xs: "100%", md: "100%", sm: "100%" },
              fontSize: { xs: "12px", md: "14px", sm: "14px" },
            }}
          />
        </Grid>
      </Grid>

      <Grid mt={2}>
        <CustomTable
          maxWidth={"100%"}
          tableHeaders={tableHeaders}
          tableData={tableData}
          handleEdit={handleEdit}
        />
      </Grid>

      <Dialog open={openModal} onClose={handleModalClose} fullWidth>
        <DialogTitle sx={styles.dialogTitle}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {isEditMode ? "Update Student" : "Add Student"}
          </Typography>
          <IconButton onClick={handleModalClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container sx={styles.formGrid}>
            <Grid size={{ xs: 12, md: 5 }}>
              <CustomTextField
                label="First Name*"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter"
                error={!!formErrs.firstName}
                helperText={formErrs.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <CustomTextField
                label="Last name*"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter"
                error={!!formErrs.lastName}
                helperText={formErrs.lastName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <CustomTextField
                select
                label="Gender*"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                placeholder="Enter"
                error={!!formErrs.gender}
                helperText={formErrs.gender}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </CustomTextField>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <CustomTextField
                label="Phone Number*"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter"
                error={!!formErrs.phone}
                helperText={formErrs.phone}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <CustomTextField
                label="Email*"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter"
                error={!!formErrs.email}
                helperText={formErrs.email}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: "relative" }}>
                <CustomTextField
                  label="Password*"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={!!formErrs.password}
                  helperText={formErrs.password}
                  fullWidth
                  // disabled = {isEditMode}
                />
                
                <Button
                  onClick={handleGeneratePassword}
                  sx={styles.generateButton}
                >
                  Generate
                </Button>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 10.5 }}>
              <CustomTextField
                label="Address*"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter"
                error={!!formErrs.address}
                helperText={formErrs.address}
              />
            </Grid>
          </Grid>
          <Grid
            item
            sx={{ display: "flex", justifyContent: "center" }}
            size={{ xs: 12, md: 6 }}
          >
            <CustomButton
              children={isEditMode ? "Update" : "Add"}
              loading={false}
              bgColor="#EAB308"
              sx={{ width: "20%" }}
              onClick={() =>
                isEditMode
                  ? updateStudent(editingStudentId)
                  : handleSubmit()
              }
              // onClick={ isEditMode ? updateStudent(): handleSubmit()}
            />
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default AdminStudentProfile;
