import { apiGet, apiPost } from "../../../api/axios";
import CustomTable from "../../../components/admin/CustomTable";
import CustomButton from "../../../components/admin/CustomButton";
import CustomTextField from "../../../components/admin/CustomTextField";
import CustomTypography from "../../../components/admin/CustomTypography";
import { snackbarEmitter } from "../../../components/admin/CustomSnackbar";
import Navbar from "../../../components/admin/Navbar";
import { getAdminRoutePrefix } from "../../../utils/RoutePrefix";

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "Exo",
    fontWeight: 500,
    fontSize: { xs: "18px", md: "24px" },
    color: "#111827",
  },
  buttonWrap: {
    display: "flex",
    justifyContent: { xs: "flex-end", sm: "flex-end" },
  },
  addBtn: {
    color: "white",
    width: "auto",
    // fontFamily:"Lexend",
    fontWeight: "300",
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

function Institution() {
  const [openModal, setOpenModal] = useState(false);

  const [institutes, setInstitutes] = useState([]);
  const [id, setId] = useState();
  const routePrefix = getAdminRoutePrefix();

  const fetchInstitute = async () => {
    try {
      const response = await apiGet("/admin/getAllInstitute");
      // console.log("Response data:", response.data);
      if (response.data?.status === 200) {
        setInstitutes(response.data.data);
      } 
    } catch (error) {
      snackbarEmitter(error?.response?.data?.message || "Something went wrong", "error");
    }
  };

  useEffect(() => {
    fetchInstitute();
  }, []);

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setOpenModal(false); 
    setId('');
    setFormData({});
     setFormErrs({});
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    instituteName: "",
    department: "",
    email: "",
    password: "",
    phone: "",
    subscriptionAmt: "",
    subscriptionPeriod: "",
    currentAddress: "",
    permanentAddress: "",
    transactionId: "",
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formErrs, setFormErrs] = useState({});

  const handleErrors = () => {
    const errs = {};

    if (!formData.instituteName)
      errs.instituteName = "Institute name is required";

    if (!formData.department) errs.department = "Department is required";

    if (!formData.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Invalid email";

    if (!formData.phone) errs.phone = "Phone number is required";

    if (!formData.subscriptionAmt)
      errs.subscriptionAmt = "Subscription amount is required";

    if (!formData.subscriptionPeriod)
      errs.subscriptionPeriod = "Subscription period is required";

    if (!formData.password) errs.password = "Password is required";

    if (!formData.currentAddress)
      errs.currentAddress = "Current address is required";

    if (!formData.permanentAddress)
      errs.permanentAddress = "Permanent address is required";

    // if (!formData.transactionId)
    //   errs.transactionId = "Transaction ID is required";

    setFormErrs(errs);
    return errs;
  };
s

  const resetFormData = () => {
  setFormData({
    instituteName: "",
    department: "",
    email: "",
    phone: "",
    password: "",
    subscriptionAmt: "",
    subscriptionPeriod: "",
    currentAddress: "",
    permanentAddress: "",
    transactionId: "",
  });
};


  const handleAddInstitute = async () => {
    const errors = handleErrors();
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      // setLoading(true);
      // console.log("Adding institute with data:", formData);
      const response = await apiPost("/admin/addInstitute", formData);
      // console.log("Response data:", response.data);

      console.log("Response status:", response);
    

      if (response.data.status === 200) {
        snackbarEmitter(response.data.message, "success");
        handleModalClose();
        resetFormData();
          
      } else {
        snackbarEmitter("Failed to add institute", "error");
      }
      fetchInstitute();

     
    } catch (error) {
      // console.error("Error adding institute:", error);
      snackbarEmitter("Something went wrong", "error");

      // setTimeout(() => { setLoading(false);}, 2000);
    }
  };




  const updateInstituteStudents = async (id) => {

    
    const req = {
      instituteName: formData.instituteName,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      // subscriptionAmt: formData.subscriptionAmt,
      // subscriptionPeriod: formData.subscriptionPeriod,
      currentAddress: formData.currentAddress,
      permanentAddress: formData.permanentAddress,
      // transactionId: formData.transactionId,
    };

    try {
      const response = await apiPost("/admin/updateInstitute", { instituteId:id, ...req });
      // console.log("Update response:", response.data);
      if (response.data.status === 200) {
        snackbarEmitter(response.data.message, "success");
        resetFormData();
        handleModalClose();
        fetchInstitute();
      } 
    } catch (error) {
      snackbarEmitter("Something went wrong", "error");
    }
  };


  const navigate = useNavigate();

  const handleClick = (institute) => {
    // console.log("Navigating to institute details for:", institute._id);
    navigate(`${routePrefix}/institutiondetails`, {
      state: { instituteId: institute._id },
    });
  };


  const handleEdit = async (institute) => {
    const response = await apiPost(`/admin/getInstitute`, { instituteId: institute._id });
    setId(institute._id);

    console.log(response);
    handleModalOpen();
    setFormData({
      instituteName: response.data.data.instituteName,
      department: response.data.data.department,
      email: response.data.data.email,
      phone: response.data.data.phone,
     // password: response.data.data.password,
      subscriptionAmt: response.data.data.subscriptionAmt,
      subscriptionPeriod: String(response.data.data.subscriptionPeriod ?? ""),
      currentAddress: response.data.data.currentAddress,
      permanentAddress: response.data.data.permanentAddress,
      transactionId: response.data.data.transactionId,
    });

  };

  const handleGeneratePassword = async () => {
    const response = await apiGet("/admin/instituteAutogeneratedPassword");
    // console.log("Generated password:", response);
    const password = response.data.data;
    setFormData({ ...formData, password });
  };

  const tableHeaders = ["Sr no","Institute Name","Number of students","Status","Action",];

  const table = institutes.map((institute) => ({
    institute,
    row: [
      <Box onClick={() => handleClick(institute)} sx={{ cursor: "pointer" }}>
        {institute.instituteName}
      </Box>,
      <Box onClick={() => handleClick(institute)} sx={{ cursor: "pointer" }}>
        {institute.totalStudents}
      </Box>,
      <Box onClick={() => handleClick(institute)} sx={{ cursor: "pointer" }}>
        <CustomButton
          children={institute.isactive ? "Active" : "Inactive"}
          loading={false}
          bgColor={institute.isactive ? "#109CF1" : "#F44336"}
          sx={{
            width: { xs: "50px", sm: "60px", md: "70px" },
            fontSize: { xs: "10px", sm: "11px", md: "12px" },
          }}
        />
      </Box>,
      <IconButton onClick={(e) => { e.stopPropagation(); handleEdit(institute); }}>
        <img src="/images/edit.svg" alt="Edit" style={{ width: 20, height: 20 }} />
      </IconButton>,
    ],
  }));

  return (
    <>
      <Navbar title="Institution">
        <Grid container sx={styles.container}>
          <Grid size={{ xs: 6, sm: 6, md: 6 }}>
            <CustomTypography
              text="List of Institution"
              fontWeight={500}
              fontSize={{ xs: "18px", md: "22px", sm: "20px" }}
            />
          </Grid>
          <Grid>
            <CustomButton
              children="Add Institute"
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

        <Grid size={{ xs: 12 }} mt={2}>
          <CustomTable
            maxWidth={"100%"}
            tableData={table}
            tableHeaders={tableHeaders}
          />
        </Grid>

        <Dialog open={openModal} onClose={handleModalClose} fullWidth>
          <DialogTitle sx={styles.dialogTitle}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {id ? "Update" : "Add"} Institution
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container sx={styles.formGrid}>
              <Grid size={{ xs: 12, md: 5 }}>
                <CustomTextField
                  label="Institute Name*"
                  name="instituteName"
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={!!formErrs.instituteName}
                  helperText={formErrs.instituteName}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <CustomTextField
                  label="Department*"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={!!formErrs.department}
                  helperText={formErrs.department}
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
                  label="Subscription Amount*"
                  name="subscriptionAmt"
                  value={formData.subscriptionAmt}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={!!formErrs.subscriptionAmt}
                  helperText={formErrs.subscriptionAmt}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <CustomTextField
                  label="Subscription Period*"
                  select
                  name="subscriptionPeriod"
                  value={formData.subscriptionPeriod}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={!!formErrs.subscriptionPeriod}
                  helperText={formErrs.subscriptionPeriod}
                >
                  <MenuItem value="1">1 month</MenuItem>
                  <MenuItem value="6">6 months</MenuItem>
                  <MenuItem value="12">12 months</MenuItem>
                </CustomTextField>
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
                  />
                  <Button
                    onClick={handleGeneratePassword}
                    sx={styles.generateButton}
                  >
                    Generate
                  </Button>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <CustomTextField
                  label="Transaction ID"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  placeholder="Enter"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 10.5 }}>
                <CustomTextField
                  label="Current Address*"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={!!formErrs.currentAddress}
                  helperText={formErrs.currentAddress}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 10.5 }}>
                <CustomTextField
                  label="Permanent Address*"
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  placeholder="Enter"
                  error={!!formErrs.permanentAddress}
                  helperText={formErrs.permanentAddress}
                />
              </Grid>
            </Grid>

            <Grid
              item
              sx={{ display: "flex", justifyContent: "center" }}
              size={{ xs: 12, md: 6 }}
            >
              <CustomButton
                children={id ? "Update" : "Add"}
                onClick={() => (id ? updateInstituteStudents(id) : handleAddInstitute())}
                loading={false}
                bgColor="#EAB308"
                sx={{ width: "20%" }}
              />
            </Grid>
          </DialogContent>
        </Dialog>
      </Navbar>
    </>
  );
}
export default Institution;
