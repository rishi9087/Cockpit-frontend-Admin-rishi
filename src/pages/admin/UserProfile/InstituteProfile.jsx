import { apiGet, apiPost, apiPostUpload } from "../../../api/axios";
import Navbar from "../../../components/admin/Navbar";
import CustomTextField from "../../../components/admin/CustomTextField";
import { snackbarEmitter } from "../../../components/admin/CustomSnackbar";
import CustomButton from "../../../components/admin/CustomButton";
import styles from "./profilestyles.js";
import CustomTypography from "../../../components/admin/CustomTypography.jsx";

const InstituteProfile = () => {

  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    instituteName: "",
    department: "",
    phone: "",
    address: "",
    subsrciptionAmt: "",
    subscriptionPeriod: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState(formData);
  const [profileImage, setProfileImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const [errors, setErrors] = useState({});


  const getProfile = async () => {
    try {
      const {
        data: { data },
      } = await apiGet('/getInstitute')
      const newFormData = {
        instituteName: data.institeDetails.instituteName || "",
        phone: data.institeDetails.phone || "",
        department: data.institeDetails.department || "",
        address: data.institeDetails.currentAddress || "",
        subsrciptionAmt: data.subscriptionDetails.subscriptionAmt || "",
        subscriptionPeriod: data.subscriptionDetails.subscriptionPeriod || "",
      };
      setFormData(newFormData);
      setInitialFormData(newFormData);
      setProfileImage(data.institeDetails.profileimage || "");
      setLogoImage(data.institeDetails.logo || "");
      setEmail(data.institeDetails.email);
    } catch (error) {
      snackbarEmitter("Error fetching profile", "error");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.instituteName) errs.firstname = "Institute name is required";
    if (!formData.phone) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errs.phone = "Enter Valid Phone Number";
    }
    if (!email) errs.email = "Email is required";
    if (!formData.address) errs.address = "Address is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      snackbarEmitter("Please fill all required fields", "warning");
      return;
    }
    setErrors({});
    // setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("instituteName", formData.instituteName);
      formDataToSend.append("email", email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("permanentAddress", formData.address);

      if (profileImage instanceof File) {
        formDataToSend.append("profileimage", profileImage);
      }
      if (logoImage instanceof File) {
        formDataToSend.append("logo", logoImage);
      }


      const response = await apiPostUpload("/updateInstitute", formDataToSend);
      setLoading(false);
      if (response.data.status === 200) {
        snackbarEmitter(response.data.message, "success");

      } else {
        snackbarEmitter(response.data.message, "error");
      }
      getProfile();
    } catch (error) {
      setLoading(false);
      snackbarEmitter("Unexpected Error", "error");
    }
  };


  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = ({ target: { files } }) => {
    const file = files[0];
    if (file) setProfileImage(file);
  };
  const handleLogoChange = ({ target: { files } }) => {
    const file = files[0];
    if (file) setLogoImage(file);
    console.log("logo image", logoImage);

  };

  const handleCancel = () => setFormData(initialFormData);

  const inputFields = [
    { name: "instituteName", placeholder: "First Name", value: formData.instituteName },
    { name: "phone", placeholder: "Mobile Number", value: formData.phone },
    { name: "email", placeholder: "Email Address", value: email, disabled: true },
    { name: "address", placeholder: "Address", value: formData.address },
    { name: "subsrciptionAmt", placeholder: "Subscription Amount", value: formData.subsrciptionAmt, disabled: true },
    { name: "subscriptionPeriod", placeholder: "Subscription Period", value: formData.subscriptionPeriod, disabled: true },
  ];


  return (
    <Box>
      <Card elevation={3} sx={styles.card}>
        <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
          <Grid size={{ xs: 12, md: 12, sm: 12 }} sx={styles.profileImageContainer}>
            <Box>
               <label style={styles.labelBox}>
              {profileImage ? (
                  <img src={profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImage} alt="Profile" style={styles.profileImage} />
                ) : (
                  <CameraAltIcon fontSize="large" />
                )}

               <input type="file" id="profile-upload" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
            </label>

            <CustomTypography text="Upload profile" sx={{fontSize: { xs: '10px', sm: '11px', md: '12px' }}} />

              {/* <Box sx={styles.profileImageBox} >

              <label htmlFor="profile-upload" style={styles.profileImageBox}>
                {profileImage ? (
                  <img src={profileImage instanceof File ? URL.createObjectURL(profileImage) : profileImage} alt="Profile" style={styles.profileImage} />
                ) : (
                  <CameraAltIcon fontSize="large" />
                )}
              </label>
              <input type="file" id="profile-upload" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />

              </Box>
              <CustomTypography text="Upload profile" /> */}

            </Box>

           


            <Box>
                <label htmlFor="logo-upload" style={styles.labelBox}>
                  {logoImage ? (
                    <img src={logoImage instanceof File ? URL.createObjectURL(logoImage) : logoImage} alt="image" style={styles.profileImage} />
                  ) : (
                    <CameraAltIcon fontSize="large" />

                  )}
                </label>
                <input type="file" id="logo-upload" accept="image/*" style={{ display: "none" }} onChange={handleLogoChange} />

              <CustomTypography text="Upload logo" sx={{fontSize: { xs: '10px', sm: '11px', md: '12px' }}} />

            </Box>

          </Grid>
          {inputFields.map((field, index) => (
            <Grid key={index} size={{ xs: 12, md: 6 }}>
              <CustomTextField name={field.name} placeholder={field.placeholder} value={field.value} onChange={handleChange} required error={!!errors[field.name]} helperText={errors[field.name]}
                {...(field.disabled && { disabled: true })} />
            </Grid>
          ))}

          <Grid size={{ xs: 12 }} sx={styles.buttonsContainer}>
            <Button variant="contained" onClick={handleCancel} sx={styles.cancelButton} >Cancel </Button>
            <CustomButton type="submit" loading={loading} bgColor="#EAB308" borderRadius="10px" sx={styles.saveButton} >  Save </CustomButton>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default InstituteProfile;