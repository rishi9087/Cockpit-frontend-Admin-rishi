import { snackbarEmitter } from './CustomSnackbar';
import { apiGet } from '../../api/axios';
import CustomButton from './CustomButton';
import CustomTypography from './CustomTypography';
import { getAdminRoutePrefix } from '../../utils/RoutePrefix';
import { useAuth } from '../../context/AuthContext';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

const Navbar = ({ title, children }) => {
  const { logout, adminId, instituteId, instituteToken, adminToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const routePrefix = getAdminRoutePrefix();


  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openDatabase, setOpenDatabase] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleDatabaseMenu = () => setOpenDatabase((prev) => !prev);

  const isActive = (path) => location.pathname === path;

  const handleNavigate = (route) => {
    navigate(`${routePrefix}${route}`);
    if (sidebarOpen) setSidebarOpen(false);
  };

  const subRoutes = ['/admin/trainingAdd', '/admin/feedback'];

  useEffect(() => {
    if (subRoutes.includes(location.pathname)) {
      setOpenDatabase(true);
    }
  }, [location.pathname]);

  const [adminData, setAdminData] = useState({
    profileimage: "",
    firstname: "",
    role: "",
  });

  const getProfile = async () => {
    try {

      const response = await apiGet(`/admin/getAdmin?adminId=${adminId}`);
      // console.log("admin data",response.data.data);


      if (response.data.status === 200) {
        setAdminData({
          profileimage: response.data.data.profileimage,
          firstname: response.data.data.firstname || response.data.data.instituteName,
          role: response.data.data.role,
        });

      } else {
        snackbarEmitter(response.data.message, 'error');
      }

    } catch (error) {
      snackbarEmitter("Error fetching profile", "error");
    }
  };



  const [instituteData, setInstituteData] = useState({});

  const getInstituteProfile = async () => {
    try {
      const response = await apiGet('/getInstitute');

      if (response.data.status === 200) {
        setInstituteData(response.data.data);
      }
      else {
        snackbarEmitter(response.data.message, 'error');
      }
    } catch (error) {
      snackbarEmitter("Error fetching profile", "error");
    }
  };

  useEffect(() => {
    instituteId ? getInstituteProfile() : getProfile();

  }, []);


  const [open, setOpen] = useState(false);
  // const navigate = useNavigate();

  const handleLogoutClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const confirmLogout = () => {
    setOpen(false);
    logout();
    navigate('/adminlogin');
  };

  const suggestionsList = [

    { label: 'Dashboard', path: `${routePrefix}/dashboard` },
    { label: 'Profile', path: `${routePrefix}/profile` },
    { label: 'Feedback', path: `${routePrefix}/feedback` },
    { label: 'Syllabus', path: `${routePrefix}/trainingSyllabus` },
    { label: 'Training', path: `${routePrefix}/trainingAdd` },
    ...(!instituteId ? [{ label: 'Pricing', path: `${routePrefix}/pricing` }] : [])

  ];

  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const filtered = suggestionsList.filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSelect = (path) => {
    navigate(path);
    setQuery('');
    setFilteredSuggestions([]);
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Grid
        item
        size={{ xs: sidebarOpen ? 8 : 0, md: 2, sm: 4 }}
        sx={{
          bgcolor: 'white',
          borderRight: '1px solid #ddd',
          height: '100vh',
          overflowY: 'auto',
          position: { xs: 'fixed', md: 'relative' },
          top: 0,
          left: 0,
          zIndex: 1300,
          display: { xs: sidebarOpen ? 'block' : 'none', md: 'block' },
          transition: 'all 0.3s ease',
          boxShadow: { xs: sidebarOpen ? '2px 0 5px rgba(0,0,0,0.3)' : 'none', md: 'none' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '90vh' }}>
          {/* Close button for mobile */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'flex-end',
              mb: 2,
            }}
          >
            <IconButton onClick={() => setSidebarOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3, cursor: 'pointer' }} >
            {
              !instituteId && <img
                src={'/images/full logo.svg'}
                alt="Add Logo"
                style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                onClick={() => handleNavigate('/dashboard')}
              />

            }

            {instituteId && (
              instituteData?.institeDetails?.logo? <img
                src={instituteData?.institeDetails?.logo}
                alt="Logo"
                style={{ width: '100px', height: 'auto', marginBottom: '10px' }}
                onClick={() => handleNavigate('/profile')}
              /> :
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', justifyContent: 'center' }} onClick={() => handleNavigate('/profile')}>
                  <Avatar sx={{ bgcolor: '#EAB308', width: 25, height: 25 }}></Avatar>
                  <Typography sx={{ fontSize: { xs: '12px', sm: '14px', md: '16px' } }}>Add logo</Typography>
                </Box>
            )


            }
          </Box>

          <Box sx={{ flexGrow: 4 }}>
            <List>
              {/* Dashboard */}
              <ListItem
                button
                onClick={() => handleNavigate('/dashboard')}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: isActive(`${routePrefix}/dashboard`) ? '#EAB308' : 'white',
                  // color: isActive('/admin/dashboard') ? 'white' : 'black',
                  cursor: 'pointer',
                  ":hover": {
                    color: 'black'
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                  <img src="/images/dashboard.svg" alt="Dashboard" />
                </ListItemIcon>
                <CustomTypography text='Dashboard' color={isActive(`${routePrefix}/dashboard`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
              </ListItem>

              <ListItem
                button
                onClick={() => handleNavigate('/trainingsyllabus')}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: isActive(`${routePrefix}/trainingsyllabus`) ? '#EAB308' : 'white',
                  cursor: 'pointer',
                  ":hover": {
                    color: 'black'
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                  <img src="/images/syllabus.svg" alt="Syllabus" />
                </ListItemIcon>
                <CustomTypography text='Syllabus' color={isActive(`${routePrefix}/trainingsyllabus`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
              </ListItem>

              {/* Database collapsible */}
              <ListItem
                button
                onClick={toggleDatabaseMenu}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 1,
                  mb: 1,
                  cursor: 'pointer',
                }}
              >
                <ListItemIcon sx={{ minWidth: 30, mr: 1 }}> {/* Increase space here */}
                  <img src="/images/database.svg" alt="Database" />
                </ListItemIcon>
                <CustomTypography text='Database' color={'#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
                {openDatabase ? <ExpandLess sx={{ color: '#8F95B2' }} /> : <ExpandMore sx={{ color: '#8F95B2' }} />}
              </ListItem>


              <Collapse in={openDatabase} timeout="auto" unmountOnExit>
                {/* <List component="div" disablePadding> */}
                <ListItem
                  button
                  sx={{
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: isActive(`${routePrefix}/trainingAdd`) ? '#EAB308' : 'white',
                    // color: isActive('/admin/trainingAdd') ? 'white' : 'black',
                    cursor: 'pointer',
                    ":hover": {
                      color: 'black'
                    }
                  }}
                  onClick={() => handleNavigate('/trainingAdd')}
                >
                  <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                    <img src="/images/database.svg" alt="img" />
                  </ListItemIcon>
                  <CustomTypography text='Training' color={isActive(`${routePrefix}/trainingAdd`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
                </ListItem>

                {
                  instituteToken &&
                  <ListItem
                    button
                    sx={{
                      pl: 4,
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: isActive(`${routePrefix}/test`) ? '#EAB308' : 'white',
                      // color: isActive('/admin/trainingAdd') ? 'white' : 'black',
                      cursor: 'pointer',
                      ":hover": {
                        color: 'black'
                      }
                    }}
                    onClick={() => handleNavigate('/test')}
                  >
                    <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                      <img src="/images/database.svg" alt="img" />
                    </ListItemIcon>
                    <CustomTypography text='Test' color={isActive(`${routePrefix}/test`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
                  </ListItem>
                }

                <ListItem
                  button
                  sx={{
                    pl: 4,
                    borderRadius: 2,
                    bgcolor: isActive(`${routePrefix}/feedback`) ? '#EAB308' : 'white',
                    // color: isActive('/admin/feedback') ? 'white' : 'black',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleNavigate('/feedback')}
                >
                  <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                    <img src="/images/database.svg" alt="Feedback" />
                  </ListItemIcon>
                  <CustomTypography text='Feedback' color={isActive(`${routePrefix}/feedback`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
                </ListItem>
                {/* </List> */}
              </Collapse>

              {
                adminToken &&
                <ListItem
                  button
                  onClick={() => handleNavigate('/pricing')}
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: isActive(`${routePrefix}/pricing`) ? '#EAB308' : 'white',
                    // color: isActive('/admin/pricing') ? 'white' : 'black',
                    cursor: 'pointer',
                    ":hover": {
                      color: 'black'
                    },

                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                    <img src="/images/donate.svg" alt="Pricing" />
                  </ListItemIcon>
                  <CustomTypography text='Pricing' color={isActive(`${routePrefix}/pricing`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
                </ListItem>

              }


              {
                adminToken &&
                <ListItem
                  button
                  onClick={() => handleNavigate('/institution')}
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: isActive(`${routePrefix}/institution`) ? '#EAB308' : 'white',
                    // color: isActive('/admin/pricing') ? 'white' : 'black',
                    cursor: 'pointer',
                    ":hover": {
                      color: 'black'
                    },

                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                    <img src="/images/institution.svg" alt="institution" />
                  </ListItemIcon>
                  <CustomTypography text='Institution' color={isActive(`${routePrefix}/institution`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
                </ListItem>
              }



              <ListItem
                button
                onClick={() => handleNavigate('/studentProfile')}
                sx={{
                  fontWeight: 'bold',
                  borderRadius: 2,
                  mb: 1,
                  bgcolor: isActive(`${routePrefix}/studentProfile`) ? '#EAB308' : 'white',
                  // color: isActive('/admin/pricing') ? 'white' : 'black',
                  cursor: 'pointer',
                  ":hover": {
                    color: 'black'
                  },

                }}
              >
                <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                  <img src="/images/3-User.svg" alt="img" />
                </ListItemIcon>
                <CustomTypography text='Student profile' color={isActive(`${routePrefix}/studentProfile`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
              </ListItem>


              {
                adminToken &&
                <ListItem
                  button
                  onClick={() => handleNavigate('/advertise')}
                  sx={{
                    fontWeight: 'bold',
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: isActive(`${routePrefix}/advertise`) ? '#EAB308' : 'white',
                    // color: isActive('/admin/pricing') ? 'white' : 'black',
                    cursor: 'pointer',
                    ":hover": {
                      color: 'black'
                    },

                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30, mr: 1 }}>
                    <AddBusinessIcon sx={{ color: '#8F95B2' }} />
                  </ListItemIcon>
                  <CustomTypography text='Advertise' color={isActive(`${routePrefix}/advertise`) ? 'white' : '#8F95B2'} fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
                </ListItem>
              }


            </List>
          </Box>

          <List>
            <ListItem
              button
              onClick={handleLogoutClick}
              sx={{
                fontWeight: 'bold',
                borderRadius: 2,
                // mb: 1,
                bgcolor: '#EAB308',
                color: 'white',
                cursor: 'pointer',
                ":hover": {
                  color: 'black'
                },
                // mt:15
                position: 'relative',
                // top:{xs:'85%',md:'80%',sm:'80%'},
                // width:{xs:'50%',md:'13%',sm:'25%'}
              }}
            >

              <ListItemIcon>
                <img src="/images/Logout.svg" alt="" />
              </ListItemIcon>
              <CustomTypography text='Logout' fontSize={{ xs: '14px', sm: '16px', md: '16px' }} mb={0} fontWeight={500} />
            </ListItem>
          </List>
        </Box>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      // fullWidth
      >
        <DialogTitle id="logout-dialog-title"><CustomTypography text='Confirm Logout?' fontSize={{ xs: '16px', md: '18px', sm: '18px' }} fontWeight={600} /></DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            <CustomTypography text='Do you want to logout?' fontSize={{ xs: '14px', md: '16px', sm: '16px' }} />
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', gap: 0.5, mb: 1 }} >
          <CustomButton children='Logout' onClick={confirmLogout} bgColor='#EAB308' sx={{ width: { xs: '50%', md: '30%', sm: '30%' }, fontSize: { xs: '11px', md: '13px', sm: '13px' } }} />
          <CustomButton children='Cancel' onClick={handleClose} bgColor='#BF0000' sx={{ width: { xs: '50%', md: '30%', sm: '30%' }, fontSize: { xs: '11px', md: '13px', sm: '13px' } }} />
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Grid
        item
        size={{ xs: 12, md: 10 }}
        sx={{
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          ml: { xs: 0, md: 0 },
        }}
      >
        {/* Header */}
        <AppBar position="static" color="white" elevation={0}>

          {/* Mobile View: Top Row */}
          <Toolbar
            sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              minHeight: 48,
            }}
          >
            {/* Menu icon */}
            <IconButton onClick={toggleSidebar} size="small" edge="start" color="inherit">
              <MenuIcon fontSize="small" />
            </IconButton>

            {/* Logo center */}
            <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
              <img
                src={instituteId ? instituteData?.institeDetails?.logo : '/images/full logo.svg'}
                alt="Add Logo"
                style={{ width: '80px', height: 'auto' }}
              />
            </Box>

            {/* Admin text */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={() => handleNavigate('/profile')}>
              <Avatar sx={{ width: 25, height: 25, }}
                src={instituteId ? instituteData?.institeDetails?.profileimage : adminData?.profileimage}
              >
                {instituteId ? instituteData?.institeDetails?.instituteName : adminData?.firstname?.charAt(0).toUpperCase()}

              </Avatar>
            </Box>
          </Toolbar>

          {/* Mobile View: Second Row */}
          <Toolbar
            sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 0.5,
              minHeight: 40,
              gap: 1,
            }}
          >
            {/* Title */}
            {/* <Typography
              sx={{
                fontSize: '12px',
                fontWeight: 'bold',
                flexGrow: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              noWrap
            >
              {title}
            </Typography> */}
            <CustomTypography text={title} fontSize={{ xs: '18px', md: '22px', sm: '22px' }} fontWeight={600} />

            {/* Search bar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#f0f0f0',
                px: 1,
                py: 0.5,
                borderRadius: '5px',
                width: 140,
                fontSize: '0.75rem',
                flexShrink: 0,
              }}
            >
              <SearchIcon sx={{ fontSize: 16, mr: 0.5 }} />
              <InputBase
                placeholder="Search..."
                value={query}
                onChange={handleChange}
                sx={{ fontSize: '0.75rem', width: '100%' }}
                inputProps={{ 'aria-label': 'search' }}
              />

              {filteredSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    // left: '50%',
                    // right: 0,
                    zIndex: 1,
                    mt: 0.5,
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 3,
                    borderRadius: 1,
                    width: { xs: '40%', sm: '20%' },
                  }}
                >
                  <List dense>
                    {filteredSuggestions.map((item) => (
                      <ListItemButton key={item.label} onClick={() => handleSelect(item.path)}>
                        <CustomTypography text={item.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Paper>
              )}



            </Box>

            {/* Notification icon */}
            {/* <IconButton size="small" sx={{ p: 0.5 }}>
              <NotificationsIcon fontSize="small" />
            </IconButton> */}
          </Toolbar>

          {/* Desktop / Laptop View: Single Clean Row */}
          <Toolbar
            sx={{
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'space-between',
              alignItems: 'center',
              // px: 2,
              // py: 1,
            }}
          >
            {/* Title */}
            {/* <Typography
              sx={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              {title}
            </Typography> */}
            <CustomTypography text={title} fontSize={{ xs: '20px', md: '22px', sm: '22px' }} fontWeight={600} />

            {/* Right section */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: '350px', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: '#f0f0f0',
                  p: 1,
                  borderRadius: '5px',
                  // width: '70%', // increased width to fit icon + text
                  fontSize: '0.75rem',
                  flexShrink: 0,
                }}
              >
                <SearchIcon sx={{ fontSize: '20px', mr: 0.5 }} />
                <InputBase
                  placeholder="Search..."
                  value={query}
                  onChange={handleChange}
                  sx={{ fontSize: '0.75rem', width: '100%' }}
                  inputProps={{ 'aria-label': 'search' }}
                />

                {filteredSuggestions.length > 0 && (
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      // left: '50%',
                      // right: 0,
                      zIndex: 1,
                      mt: 0.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 3,
                      borderRadius: 1,
                      width: '20%',

                    }}
                  >
                    <List dense>
                      {filteredSuggestions.map((item) => (
                        <ListItemButton key={item.label} onClick={() => handleSelect(item.path)}>
                          <CustomTypography text={item.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                )}

              </Box>
              {/* <IconButton>
                <NotificationsIcon />
              </IconButton> */}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => handleNavigate('/profile')}>
              <Avatar sx={{ width: 40, height: 40 }}
                src={instituteId ? instituteData?.institeDetails?.profileimage : adminData.profileimage}
              >
                {adminData?.firstname?.charAt(0)?.toUpperCase()}</Avatar>
              <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                {/* <Typography variant="body1">
                  {adminData?.username}
                </Typography> */}
                <CustomTypography text={instituteId ? instituteData?.institeDetails?.instituteName : adminData?.firstname} fontSize={{ xs: '12px', md: '14px', sm: '14px' }} mb={0} fontWeight={600} />
                {/* <Typography variant="caption" color="text.secondary">
                  {adminData?.role === "super_admin" ? "Super Admin" : "Admin"}
                  
                </Typography> */}
                <CustomTypography text={adminData?.role === "super_admin" ? "Super Admin" : "Admin"} fontSize={{ xs: '10px', md: '12px', sm: '12px' }} mb={0} fontWeight={400} />
              </Grid>

            </Box>

          </Toolbar>
        </AppBar>

        {/* Content area */}
        <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#fafafa' }}>{children}</Box>
      </Grid>
    </Grid>
  );
};

export default Navbar;
