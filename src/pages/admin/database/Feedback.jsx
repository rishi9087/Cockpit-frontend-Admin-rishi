import Navbar from "../../../components/admin/Navbar";
import CustomTypography from "../../../components/admin/CustomTypography";
import CustomTextArea from "../../../components/admin/CustomTextArea";
import { snackbarEmitter } from "../../../components/admin/CustomSnackbar";
import { apiGet, apiPost } from "../../../api/axios";
import CustomButton from "../../../components/admin/CustomButton";
import Training from "../../../components/admin/Training";
import { useAuth } from "../../../context/AuthContext";

function Feedback() {

  const location = useLocation();
  const { reportID } = location.state || {};

  const {instituteId} = useAuth();

  console.log('reportId', reportID);

  const styles = {
    toggleBox: {
      bgcolor: "#fff",
      borderRadius: 2,
      boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
      p: { xs: 2, md: 3 },
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      mt: 2,
    },
    sectionBox: {
      bgcolor: "#fff",
      borderRadius: 2,
      boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
      p: { xs: 2, md: 2 },
      mt: 2,
      width: "100%",
    },
    sectionTitle: {
      color: "orange",
      fontWeight: 600,
      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
      mb: 1,
    },
    sectionText: {
      fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
      color: "#333",
    },
    buttonGroup: {
      mt: 2,
      display: "flex",
      gap: 2,
      justifyContent: "center",
    },
    actionButton: {
      bgcolor: "green",
      color: "#fff",
      '&:hover': {
        bgcolor: "darkgreen",
      },
      px: 3,
      py: 1,
      fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" }
    }
  };

  const [reports, setReports] = useState([]);

  const fetchReports = async () => {

    try {
      const response = await apiGet('/reports');

      if (response.data.status === 200) {
        // setOpen(null);
        const filteredReports = response.data.data.filter((report) => report.status === 'pending');
        if (filteredReports.length === 0) {
          setOpen(null);
          setReports([]); 
          snackbarEmitter('No pending reports found', 'info');
        } else {
          setReports(filteredReports);
        }
      }
      else {
        snackbarEmitter(response.data.message, 'error');
      }

    } catch (error) {
      snackbarEmitter('Something went wrong', 'error');
    }
  };

  const InsfetchReports = async () => {

    try {
      const response = await apiGet('/getAllReport');

      if (response.data.status === 200) {
        // setOpen(null);
        const filteredReports = response.data.data.filter((report) => report.status === 'pending');
        if (filteredReports.length === 0) {
          setOpen(null);
          setReports([]); 
          snackbarEmitter('No pending reports found', 'info');
        } else {
          setReports(filteredReports);
        }
      }
      else {
        snackbarEmitter(response.data.message, 'error');
      }

    } catch (error) {
      snackbarEmitter('Something went wrong', 'error');
    }
  };

  useEffect(() => {
   instituteId ? InsfetchReports() : fetchReports();
  }, [])


  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (reportID) {
      setOpen(reportID);
    }
  }, [reportID]);

  const handleModalClose = () => {

    setOpenModal(false);
    setFormData({
      syllabus: "",
      book: "",
      chapter: "",
      question: {
        _id: "",
        question: "",
        options: [],
        explanation: "",
      }
    });
    fetchReports();
  };

  const [formData, setFormData] = useState({
    syllabus: "",
    book: "",
    chapter: "",
    syllabusId: "",
    bookId: "",
    chapterId: "",
    question: {
      _id: "",
      question: "",
      options: [],
      explanation: "",
    }
  });

  const [openModal, setOpenModal] = useState(false);


  const handleModalOpen = (report) => {
    setOpenModal(true);
    setFormData({
      syllabus: report.questionsDetails[0]?.syllabusId.title,
      book: report.questionsDetails[0]?.bookId.bookTitle,
      chapter: report.questionsDetails[0]?.chapterId.chaptername,
      syllabusId: report.questionsDetails[0]?.syllabusId._id,
      bookId: report.questionsDetails[0]?.bookId._id,  
      chapterId: report.questionsDetails[0]?.chapterId._id,
      question: {
        _id: report.questionsDetails[0]?._id,
        question: report.questionsDetails[0]?.question,
        options: report.questionsDetails[0]?.options,
        explanation: report.questionsDetails[0]?.explanation,
      },
    });
  }


  const [customLoading, setCustomLoading] = useState({
    approveLoading: false,
    declineLoading: false,
  })

  const updateReport = async (report, status, loadbutton) => {

    const req = {
      reportId: report._id,
      status: status
    }

    if (loadbutton == 'a') {
      setCustomLoading({
        approveLoading: true,
        declineLoading: false
      })
    }
    else {
      setCustomLoading({
        approveLoading: false,
        declineLoading: true
      })
    }

    try {
      const response = await apiPost('/updateReport', req);

      setTimeout(() => {
        setCustomLoading({
          approveLoading: false,
          declineLoading: false
        })

        if (response.data.status === 200) {
          snackbarEmitter('Report updated successfully', 'success');
          fetchReports();
        }
        else {
          snackbarEmitter(response.data.message, 'error');
          fetchReports();
        }


      }, 500)
    }
    catch (error) {
      setTimeout(() => {
        setCustomLoading({
          approveLoading: false,
          declineLoading: false
        })
        snackbarEmitter('Something went wrong', 'error');
        fetchReports();
      }, 500)
    }
  }


  return (
    <Navbar title={"Feedback"}>
      <Grid container justifyContent="center" sx={{ maxHeight: '100vh', overflowY: 'scroll' }}>
        {
           reports.length > 0 && reports.map((report, index) => (
            <Grid  key={report._id} size={{ xs: 12, sm: 10, md: 10 }} >
              {/* Toggle Box */}
              <Box sx={styles.toggleBox} onClick={() => setOpen(open === report?._id ? null : report?._id)}>
                <Grid sx={{ display: "flex", alignItems: "center", gap: 2 }} >
                  <Avatar>{report?.userId?.username[0]}</Avatar>
                  <Box sx={{ display: "flex", flexDirection: "column", justifyContent: 'center' }} >

                    <CustomTypography
                      fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                      fontWeight={500}
                      text={`${report?.userId?.username} has ${report?.reason === '' ? 'reported a' : 'filed answer for a'}  question on ${report?.questionsDetails[0]?.syllabusId?.title}`}
                      mb={0} />

                    <CustomTypography
                      fontSize={{ xs: '8px', sm: '10px', md: '10px' }}
                      // fontWeight={400}
                      color="gray"
                      text={new Date(report?.createdAt).toLocaleTimeString([], {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                      mb={0}
                    />
                  </Box>


                </Grid>

                <IconButton>
                  {open === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              </Box>

              {/* Expandable Content */}
              <Collapse in={open === report?._id} >
                <Grid container spacing={2} mt={1} sx={{ display: 'flex', justifyContent: "center", backgroundColor: '#F0F0F0' }}>
                  {/* Question & Our Answer Box */}
                  <Grid size={{ xs: 8, sm: 10, md: 10 }}>
                    <Box sx={styles.sectionBox}>
                      <CustomTypography
                        fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                        color='orange'
                        fontWeight={500}
                        text='Question'
                        mb={0} />

                      <CustomTypography
                        fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                        fontWeight={500}
                        text={report.questionsDetails[0]?.question}
                        mb={0} />

                      <CustomTypography
                        fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                        color='orange'
                        fontWeight={500}
                        text='Our Answer'
                        mb={0}
                        sx={{ mt: 2 }} />

                      <CustomTypography
                        fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                        fontWeight={500}
                        text={report.questionsDetails[0]?.explanation}
                        mb={0} />
                    </Box>
                  </Grid>

                  {/* Student Answer Box */}
                  {
                    report?.reason !== '' &&
                    <Grid size={{ xs: 8, sm: 10, md: 10 }}>
                      <Box sx={styles.sectionBox}>
                        <CustomTypography
                          fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                          color='orange'
                          fontWeight={500}
                          text='Student Answer'
                          mb={0}
                        />

                        <CustomTypography
                          fontSize={{ xs: '12px', sm: '13px', md: '14px' }}
                          fontWeight={500}
                          text={report.reason}
                        />
                      </Box>
                    </Grid>
                  }


                  <Grid container sx={styles.buttonGroup} mb={2} size={{ xs: 10, sm: 12, md: 12 }} >
                    {/* <Button sx={styles.actionButton}>Approve</Button>
                    <Button sx={styles.actionButton}>Decline</Button>
                    <Button sx={styles.actionButton} onClick={() => handleModalOpen(report)}>Show question</Button> */}
                    <CustomButton children='Approve' onClick={() => updateReport(report, 'resolved', 'a')} loading={customLoading.approveLoading} bgColor='#1E9609' sx={{ width: { xs: '20%', sm: '20%', md: '20%' }, fontSize: { xs: '10px', sm: '11px', md: '12px' } }} />
                    <CustomButton children='Decline' onClick={() => updateReport(report, 'rejected', 'd')} loading={customLoading.declineLoading} bgColor='#CB1D02' sx={{ width: { xs: '20%', sm: '20%', md: '20%' }, fontSize: { xs: '10px', sm: '11px', md: '12px' } }} />
                    <CustomButton children='Show question' onClick={() => handleModalOpen(report)} loading={false} bgColor='#EAB308' sx={{ width: { xs: '20%', sm: '20%', md: '20%' }, fontSize: { xs: '10px', sm: '11px', md: '12px' } }} />
                  </Grid>
                </Grid>

                {/* Action Buttons */}

              </Collapse>
            </Grid>
          ))
        }


      </Grid>


      <Dialog open={openModal} onClose={handleModalClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Update Question</Typography>
          <IconButton onClick={handleModalClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Training syllabusNav={true} syllabusName={formData.syllabus} bookName={formData.book} chapterName={formData.chapter} syllabusId={formData.syllabusId} bookId={formData.bookId} chapterId={formData.chapterId} question={formData.question} report={true} modalClose={handleModalClose} />

        </DialogContent>
      </Dialog>

    </Navbar>
  );
}

export default Feedback;
