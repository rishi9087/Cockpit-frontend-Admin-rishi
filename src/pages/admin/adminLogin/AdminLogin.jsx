
import { apiPostNoToken } from '../../../api/axios';
import CustomTextField from '../../../components/admin/CustomTextField';
import { snackbarEmitter } from '../../../components/admin/CustomSnackbar';
import CustomButton from '../../../components/admin/CustomButton';
import './adminLogin.css';
import CustomTypography from '../../../components/admin/CustomTypography';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const styles = {
  containerBox: {
    minHeight: '100vh',
    backgroundImage: 'url(/images/signin.svg)',
    backgroundSize: 'cover',
    // objectFit: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  gridBox: {
    display: 'flex',
    alignItems: 'center',

  },
  cardPaper: {
    px: 3,
    py: 1.5,
    borderRadius: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(10px)',
    color: '#fff',
    width: 'auto',
    maxWidth: '500px',
  },
  toggleButton: (activeForm) => ({
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    padding: '4px',
    width: '100%',
    marginRight: '1rem',
    textDecoration: 'none',
    cursor: 'pointer',
    backgroundColor: activeForm ? '#EAB308' : 'none',
    borderRadius: '50px',
    textTransform: 'none'
  }),
  centeredBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: '1rem',
    backgroundColor: '#183251',
    borderRadius: '50px',
    px: 1.5,
    py: 0.5,
    // width:'100%'
  },
  secondaryText: {
    color: 'white',
    fontSize: { xs: '12px', md: '13px' },

  },
  formTextField: {

    // marginBottom: '1rem',
    '& .MuiOutlinedInput-root': {
      borderRadius: '50px',
      backgroundColor: 'white',

    },
    '& .MuiInputLabel-root': {
      color: 'grey',
      // textAlign: 'center',
      // width: '100%',

    },
    '& .MuiInputBase-input': {
      color: 'black',
      height: '15px',

    },
  },
  formGrid: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
  },
  formCheckbox: {
    color: '#bbb',
    '&.Mui-checked': { color: '#f0ad4e' },
    transform: 'scale(0.7)'
  },
  formControlLabel: {
    color: 'white',
    '& .MuiTypography-root': {
      fontSize: { xs: '13px', md: '14px' },
    },
    alignItems: 'center',
    // gap: 1,

  },
  submitButton: {
    backgroundColor: '#f0ad4e',
    color: '#fff',
    borderRadius: '50px',
    textTransform: 'none',
    padding: '5px',
    '&:hover': { backgroundColor: '#ec9f3e' },
  },
  socialIcon: {
    height: '30px',
  },

  socialBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '50px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 1,
    cursor: 'pointer',
  }
};





function AdminLogin() {

  console.log("admin login page");
  

  const { setAdminToken, setAdminId, setInstituteToken, setInstituteId } = useAuth();
  const [activeForm, setActiveForm] = useState('login');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [insloginForm, setInsLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', username: '', password: '' });

  const [loginErrors, setLoginErrors] = useState({});
  const [insloginErrors, setInsLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  const navigate = useNavigate();


  const validateLoginForm = () => {
    const errors = {};
    if (!loginForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) errors.email = 'Invalid email';
    if (!loginForm.password) errors.password = 'Password is required';

    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateInsLoginForm = () => {
    const errors = {};
    if (!insloginForm.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(insloginForm.email)) errors.email = 'Invalid email';
    if (!insloginForm.password) errors.password = 'Password is required';

    setInsLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // e.preventDefault();
    if (!validateLoginForm()) return;

    setLoading(true);

    const req = { email: loginForm.email, password: loginForm.password };
    try {
      const response = await apiPostNoToken('/admin/loginAdmin', req);
      console.log("Response :", response.data);

      setTimeout(() => {
        setLoading(false);

        if (response.data.status === 200) {
          snackbarEmitter(response.data.message, 'success');
          setAdminToken(response.data.token);
          setAdminId(response.data.data._id);
          setLoginForm({ email: '', password: '' });
          navigate('/admin/dashboard');
        } else {
          snackbarEmitter(response.data.message, 'error');
        }
      }, 500)

    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        snackbarEmitter(error.message, 'error');
      }, 500);
    }
  };


  const handleInsLogin = async () => {
    // e.preventDefault();
    if (!validateInsLoginForm()) return;

    setLoading(true);

    const req = { email: insloginForm.email, password: insloginForm.password };
    try {
      const response = await apiPostNoToken('/institute/loginInstitute', req);
      console.log("Response :", response.data);

      setTimeout(() => {
        setLoading(false);

        if (response.data.status === 200) {
          snackbarEmitter(response.data.message, 'success');
          setInstituteToken(response.data.token);
          setInstituteId(response.data.data._id);
          setInsLoginForm({ email: '', password: '' });
          navigate('/admin/institute/dashboard');
        } else {
          snackbarEmitter(response.data.message, 'error');
        }
      }, 500)

    } catch (error) {
      setTimeout(() => {
        setLoading(false);

        snackbarEmitter(error.message, 'error');
      }, 500);
    }
  };

  const handleRegister = async () => {
    // e.preventDefault();
    if (!validateRegisterForm()) return;

    const req = { ...registerForm, role: 'super_admin' };
    setLoading(true);

    try {
      const response = await apiPostNoToken('/admin/registerAdmin', req);

      setTimeout(() => {
        setLoading(false);

        if (response.data.status === 200) {
          snackbarEmitter(response.data.message, 'success');
          setRegisterForm({ email: '', username: '', password: '' });
          setActiveForm('login');
        }
        else {
          snackbarEmitter(response.data.message, 'error');
        }
      }, 500)


    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        snackbarEmitter('Something went wrong', 'error');
      }, 500)

    }
  };

  const [forgotDialogOpen, setForgotDialogOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleForgotClick = () => {

    
    
    setForgotDialogOpen(true);
  }
  const handleForgotPassword = async () => {
    console.log('active form', activeForm);
    if (!forgotEmail) {
      setForgotError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Invalid email');
      return;
    }

    setForgotError('');
    setForgotLoading(true);

    const endpoint = activeForm === 'login' ? '/admin/forgot-password' : '/institute/forgotPassword';

    try {
      const response = await apiPostNoToken(endpoint, { email: forgotEmail });


      setTimeout(() => {
        setForgotLoading(false);
        if (response.data.status === 200) {
          setForgotDialogOpen(false);
          snackbarEmitter(response.data.message, 'success');
          setForgotEmail('');

        } else {
          snackbarEmitter(response.data.message, 'error');
        }
      }, 500)


    } catch (err) {
      setTimeout(() => {
        setForgotLoading(false);
        snackbarEmitter('Something went wrong', 'error');
      }, 500);
    }
  };


  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        console.log('Access Token:', accessToken);

        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Response:', response.data);

        const userEmail = response.data.email;
        console.log('userEmail', userEmail);

        const endpoint = activeForm === 'instituteLogin' ? '/institute/AuthLoginInstitute' : '/AuthLoginAdmin';
        const userResponse = await apiPostNoToken(endpoint, { email: userEmail });
        console.log('userResponse', userResponse);

        if (userResponse.data.status === 200) {
          snackbarEmitter(userResponse.data.message, 'success');
          if (activeForm === 'instituteLogin') {
        setInstituteToken(userResponse.data.token);
        setInstituteId(userResponse.data.data._id);

          } else {
            setAdminToken(userResponse.data.token);

          }

          activeForm === 'login' ? navigate('/admin/dashboard') : navigate('/admin/institute/dashboard');
        } else {
          snackbarEmitter(userResponse.data.message, 'error');
        }

      } catch (error) {
        snackbarEmitter('Something went wrong', 'error');
      }
    },
    // onError: snackbarEmitter('Google login failed', 'error'),
  });


  return (
    <Box sx={styles.containerBox}>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', }}>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 10, md: 15 },
            left: { xs: 10, md: 45 },
          }}
        >
          <Box
            component="img"
            src="/images/full logo.svg"
            alt="logo"
            sx={{
              height: { xs: 40, sm: 60, md: 90 }, // Responsive height
              width: 'auto',
            }}
          />
        </Box>


        <Grid item size={{ xs: 11, sm: 8, md: 9 }} sx={styles.gridBox} mt={{ xs: 10, md: 0 }}>
          <Paper elevation={10} sx={styles.cardPaper}>
            <CustomTypography text=" Welcome to COCKPIT.!" sx={{ mb: 2, textAlign: 'center' }} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} />

            <Box sx={styles.centeredBox}>
              <Button sx={styles.toggleButton(activeForm === 'login')} onClick={() => setActiveForm('login')}>
                Admin Login
              </Button>
              <Button sx={styles.toggleButton(activeForm === 'instituteLogin')} onClick={() => setActiveForm('instituteLogin')}>
                Institute Login
              </Button>
            </Box>


            <CustomTypography text="Your gateway to the skies - manage your pilot profile & access training resources and management." sx={{ mt: 4, mb: 2 }} />

            {activeForm === 'login' && (
              <>
                <Grid item >
                  <CustomTextField
                    label="Email"
                    name="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="Email"
                    error={!!loginErrors.email}
                    helperText={loginErrors.email}
                    borderRadius='50px'

                  />

                </Grid>

                <Grid item mt={2}>
                  <CustomTextField
                    label="Access Key"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Access Key"
                    error={!!loginErrors.password}
                    helperText={loginErrors.password}
                    borderRadius="50px"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid container alignItems="center" gap={1} sx={styles.formGrid} mt={2} >

                  {/* <Typography onClick={() => setForgotDialogOpen(true)} variant="body2" sx={{ ...styles.secondaryText, cursor: 'pointer' }} gutterBottom>Forgot Password?</Typography> */}
                  <CustomTypography text='Forgot Password?' onClick={handleForgotClick} sx={{ cursor: 'pointer' }} />

                  <CustomButton children='Board me' onClick={handleLogin} loading={loading} bgColor='#EAB308' borderRadius='50px' />


                </Grid>

                <CustomTypography text='-OR-' fontSize={{ xs: '14px', sm: '17px', md: '18px' }} color='#A3A3A3' fontWeight={600} sx={{ textAlign: 'center' }} />


                <Grid container justifyContent="center" gap={2} >
                  {/* <Box
                    sx={styles.socialBox}
                  >
                    <img src="/images/apple.svg" alt="Apple Login" style={{ height: '24px', width: '24px' }} />
                  </Box> */}

                  <Box
                    sx={styles.socialBox}
                    onClick={handleGoogleLogin}
                  >
                    <img src="/images/google.svg" alt="Google Login" style={{ height: '24px', width: '24px' }} />
                  </Box>
                </Grid>

              </>
            )}

            {activeForm === 'instituteLogin' && (
              <>
                <Grid item >
                  <CustomTextField
                    label="Email"
                    name="email"
                    value={insloginForm.email}
                    onChange={(e) => setInsLoginForm({ ...insloginForm, email: e.target.value })}
                    placeholder="Email"
                    error={!!insloginErrors.email}
                    helperText={insloginErrors.email}
                    borderRadius='50px'

                  />

                </Grid>

                <Grid item mt={2}>
                  <CustomTextField
                    label="Access Key"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={insloginForm.password}
                    onChange={(e) => setInsLoginForm({ ...insloginForm, password: e.target.value })}
                    placeholder="Access Key"
                    error={!!insloginErrors.password}
                    helperText={insloginErrors.password}
                    borderRadius="50px"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid container alignItems="center" gap={1} sx={styles.formGrid} mt={2} >

                  {/* <Typography onClick={() => setForgotDialogOpen(true)} variant="body2" sx={{ ...styles.secondaryText, cursor: 'pointer' }} gutterBottom>Forgot Password?</Typography> */}
                  <CustomTypography text='Forgot Password?' onClick={handleForgotClick} sx={{ cursor: 'pointer' }} />

                  <CustomButton children='Board me' onClick={handleInsLogin} loading={loading} bgColor='#EAB308' borderRadius='50px' />

                </Grid>

                <CustomTypography text='-OR-' fontSize={{ xs: '14px', sm: '17px', md: '18px' }} color='#A3A3A3' fontWeight={600} sx={{ textAlign: 'center' }} />


                <Grid container justifyContent="center" gap={2} >
                  {/* <Box
                    sx={styles.socialBox}
                  >
                    <img src="/images/apple.svg" alt="Apple Login" style={{ height: '24px', width: '24px' }} />
                  </Box> */}

                  <Box
                    sx={styles.socialBox}
                    onClick={handleGoogleLogin}
                  >
                    <img src="/images/google.svg" alt="Google Login" style={{ height: '24px', width: '24px' }} />
                  </Box>
                </Grid>


              </>
            )}

          </Paper>
        </Grid>
      </Grid>

      <Dialog open={forgotDialogOpen} onClose={() => setForgotDialogOpen(false)} maxWidth="xs" fullWidth
        slotProps={
          {
            paper: {
              sx: {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(13px)',
                borderRadius: '1rem',
                color: 'white',
              },
            }
          }
        }
      >
        <DialogContent >
          <IconButton
            onClick={() => setForgotDialogOpen(false)}
            sx={{ position: 'absolute', top: 10, right: 10, color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>

          <CustomTypography text="Forgot password?" fontSize={{ xs: '20px', sm: '22px', md: '22px' }} sx={{ mb: 4 }} fontWeight={600} />
          <CustomTypography text="Verify your email address" fontSize={{ xs: '16px', sm: '18px', md: '18px' }} sx={{ mb: 2 }} fontWeight={600} />

          <CustomTypography text="We will send you reset password link on this email" fontSize={{ xs: '12px', sm: '14px', md: '14px' }} sx={{ mb: 4, }} />
          <Grid  >
            <CustomTextField
              label="Enter your email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              error={!!forgotError}
              helperText={forgotError}
              borderRadius="50px"
            />

            <Grid item sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>

              <CustomButton
                children="Send"
                onClick={handleForgotPassword}
                loading={forgotLoading}
                bgColor="#EAB308"
                borderRadius="50px"
                sx={{ width: { xs: '90%', md: '50%', sm: '60%' }, fontSize: { xs: '12px', md: '14px', sm: '14px' } }}
              />
            </Grid>

          </Grid>

        </DialogContent>
      </Dialog>



    </Box>
  );
}

export default AdminLogin;
