import { EditSquare } from "@mui/icons-material";
import { apiDelete, apiGet, apiPost } from "../../../../api/axios";
import CustomButton from "../../../../components/admin/CustomButton";
import { snackbarEmitter } from "../../../../components/admin/CustomSnackbar";
import CustomTable from "../../../../components/admin/CustomTable";
import CustomTextField from "../../../../components/admin/CustomTextField";
import CustomTypography from "../../../../components/admin/CustomTypography";
import Navbar from "../../../../components/admin/Navbar";
import { set } from "date-fns";
import { getAdminRoutePrefix } from "../../../../utils/RoutePrefix";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";

function TestQuestions() {
    const navigate = useNavigate();
    const routePrefix = getAdminRoutePrefix();

    const location = useLocation();
    const { testId, testName } = location.state;

    const [openStatusModal, setOpenStatusModal] = useState(false);
    const handleStatusModalOpen = () => setOpenStatusModal(true);
    const handleStatusModalClose = () => setOpenStatusModal(false);

    const [testQuestions, setTestQuestions] = useState([]);

    const getTestQuestions = async () => {
        try {
            const response = await apiGet(`/getTestQuestionsByTestId/${testId}`);
            //   console.log("Fetched students:", response);
            if (response.data.status === 200) {
                setTestQuestions(response.data.data);
            }
        } catch (error) {
            //   console.error("Error fetching students:", error);
            snackbarEmitter("Something went wrong", "error");
        }
    };

    useEffect(() => {
        getTestQuestions();
    }, []);



    const tableHeaders = [
        "Sr No",
        "Questions",
        "Active",
        "Action",
    ];

    const tableData = testQuestions.map((testquestions) => ({
        row: [
            <Box>{testquestions.question}</Box>,
            <CustomButton children={testquestions.isactive === true ? 'Active' : 'Inactive'} onClick={() => handleStatusClick(testquestions)} bgColor={testquestions.isactive === true ? '#109CF1' : '#D61508'} sx={{ width: { xs: '20%', sm: '20%', md: '20%' }, fontSize: { xs: '10px', sm: '11px', md: '12px' }, }} />,
            <Box>
                <IconButton color="primary" onClick={() => handleEditClick(testquestions)}>
                    <EditSquareIcon sx={{ color: '#EAB308', fontSize: { xs: '18px', sm: '20px' } }} />
                </IconButton>
            </Box>,
        ],
    }));

    const handleEditClick = (question) => {
        navigate(`${routePrefix}/addTestQuestion`, {
            state: {
                editQuestion: question,
            }
        });
    };

    const handleNavigate = (id) => {
        navigate(`${routePrefix}/addTestQuestion`, { state: { testId: testId } });
    };

    const [formData, setFormData] = useState({
        testId: '',
        syllabusId: '',
        bookId: '',
        questionID: '',
        question: '',
        options: [],
        explanation: '',
        isactive: false

    });

    const handleStatusClick = (question) => {
        setFormData({
            testId: question.testId,
            syllabusId: question.syllabusId,
            bookId: question.bookId,
            questionID: question._id,
            question: question,
            options: question.options,
            explanation: question.explanation,
            isactive: question.isactive === true ? false : true
        })

        setOpenStatusModal(true);
    };

    const updateQuestionStatus = async () => {

        const req = {
            testId: formData.testId,
            syllabusId: formData.syllabusId,
            bookId: formData.bookId,
            testQuestionId: formData.questionID,
            // question: formData.question,
            // options: formData.options,
            // explanation: formData.explanation,
            isactive: formData.isactive
        }

        console.log('before is active', req.isactive);


        // setLoading(true);


        try {
            const response = await apiPost('/updateTestQuestion', req);

            // setTimeout(() => {
            // setLoading(false);
            if (response.data.status === 200) {
                snackbarEmitter(response.data.message, 'success');
                handleStatusModalClose();
                getTestQuestions();
            }
            else {
                snackbarEmitter(response.data.message, 'error');
                handleStatusModalClose();
                getTestQuestions();
            }
            // }, 500)

        } catch (error) {
            // setTimeout(() => {
            //     setLoading(false);
            snackbarEmitter('Something went wrong', 'error');
            // }, 500)

        }
    }

    const styles = {
        container: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2
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
    };

    return (
        <>
            <Navbar title="Test">
                <Grid container sx={styles.container} size={{ xs: 12, sm: 12, md: 12 }}>
                    <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                        <CustomTypography
                            text="Test Questions"
                            fontWeight={500}
                            fontSize={{ xs: "18px", md: "22px", sm: "20px" }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} >
                             <ArrowCircleLeftRoundedIcon sx={{ color: "#EAB308", fontSize: "28px", cursor: "pointer" }} onClick={() => window.history.back()} />
                            <CustomTypography
                                text={testName}
                                fontWeight={500}
                                fontSize={{ xs: "13px", md: "16px", sm: "16px" }}
                                sx={{ textDecoration: 'underline', mt:0.5 }}
                            />
                        </Box>


                    </Grid>
                    <Grid>
                        <CustomButton
                            children="+ Add Questions"
                            onClick={handleNavigate}
                            // loading={false}
                            bgColor="#EAB308"
                            sx={{
                                width: { xs: "100%", md: "100%", sm: "100%" },
                                fontSize: { xs: "12px", md: "14px", sm: "14px" },
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid mt={2} size={{ p: 2 }}>
                    <CustomTable
                        maxWidth={"100%"}
                        tableHeaders={tableHeaders}
                        tableData={tableData}
                    //   handleEdit={handleEdit}
                    />
                </Grid>

                <Dialog open={openStatusModal} onClose={handleStatusModalClose} maxWidth="md">
                    <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Status update</Typography>
                        <IconButton onClick={handleStatusModalClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>

                        <Grid container sx={{ display: 'flex', alignItems: 'center', gap: 3 }} >
                            <Grid item>
                                <Typography sx={{ fontSize: '16px' }}>
                                    Do you want to change the status?
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Grid item>

                                        <CustomButton children='Yes' onClick={updateQuestionStatus} bgColor='#EAB308' sx={{ width: '20%' }} />
                                    </Grid>
                                    <Grid item>
                                        <CustomButton children='No' onClick={handleStatusModalClose} bgColor='#BF0000' sx={{ width: '20%' }} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>

            </Navbar>
        </>
    );
}
export default TestQuestions;
