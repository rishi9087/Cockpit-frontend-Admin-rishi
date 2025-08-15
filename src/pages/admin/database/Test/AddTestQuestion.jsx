import CustomTypography from "../../../../components/admin/CustomTypography";
import CustomTextArea from "../../../../components/admin/CustomTextArea";
import { apiGet, apiPost, apiPostUpload, apiDelete } from "../../../../api/axios";
import CustomButton from "../../../../components/admin/CustomButton";
import { snackbarEmitter } from "../../../../components/admin/CustomSnackbar";
import CustomTextField from "../../../../components/admin/CustomTextField";
import Navbar from "../../../../components/admin/Navbar";

function AddTestQuestion() {

    const location = useLocation();
    const { testId } = location?.state || {};
    const { editQuestion } = location?.state;
    console.log('editQuestion', editQuestion);


    const [test, setTest] = useState([]);
    const getTest = async () => {
        try {
            const response = await apiGet(`/getTest/${testId}`);
            //   console.log("Fetched students:", response);
            if (response.data.status === 200) {
                setFormData({
                    testId: response.data.data._id,
                    syllabusId: response.data.data.syllabusId,
                    bookId: response.data.data.bookId,
                    question: "",
                    options: [{ id: 1, text: "", isCorrect: false }, { id: 2, text: "", isCorrect: false },],
                    explanation: "",

                })
            }
        } catch (error) {
            //   console.error("Error fetching students:", error);
            snackbarEmitter("Something went wrong", "error");
        }
    };

    useEffect(() => {
        getTest();
    }, []);



    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([1, 2]);
    const [formData, setFormData] = useState({
        testId: editQuestion ? editQuestion.testId : testId,
        syllabusId: editQuestion ? editQuestion.syllabusId : "",
        bookId: editQuestion ? editQuestion.bookId : "",
        question: editQuestion ? editQuestion.question : "",
        options: editQuestion ? editQuestion.options : [{ id: 1, text: "", isCorrect: false }, { id: 2, text: "", isCorrect: false },],
        explanation: editQuestion ? editQuestion.explanation : "",
    });


    console.log("form data syllabus id", formData.syllabusId);

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.question.trim()) newErrors.question = "Question is required.";
        // if (!formData.explanation.trim())
        //   newErrors.explanation = "Explanation is required.";
        formData.options.forEach((opt, i) => {
            if (!opt.text.trim())
                newErrors[`option_${i}`] = "Option text is required.";
        });
        if (!formData.options.some((opt) => opt.isCorrect)) {
            newErrors.correct = "Please select the correct answer.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const handleExplanationChange = (value) => {
        setFormData((prev) => ({ ...prev, explanation: value }));
        setErrors((prev) => ({ ...prev, explanation: undefined }));
    };

    // =================== Option Handlers ===================
    const handleOptionTextChange = (index, value) => {
        setFormData((prev) => {
            const newOptions = [...prev.options];
            newOptions[index] = { ...newOptions[index], text: value };
            return { ...prev, options: newOptions };
        });
        setErrors((prev) => ({ ...prev, [`option_${index}`]: undefined }));
    };

    const handleOptionCorrectChange = (value) => {
        const index = parseInt(value.split("-")[1]);
        setFormData((prev) => {
            const newOptions = prev.options.map((option, i) => ({
                ...option,
                isCorrect: i === index,
            }));
            return { ...prev, options: newOptions };
        });
        setErrors((prev) => ({ ...prev, correct: undefined }));
    };

    const handleAddOption = () => {
        const newId = options.length + 1;
        setOptions((prev) => [...prev, newId]);
        setFormData((prev) => ({
            ...prev,
            options: [...prev.options, { id: newId, text: "", isCorrect: false }],
        }));
    };

    const handleDeleteOption = (indexToDelete) => {
        setOptions((prev) => prev.filter((_, index) => index !== indexToDelete));
        setFormData((prev) => ({
            ...prev,
            options: prev.options
                .filter((_, index) => index !== indexToDelete)
                .map((option, index) => ({ ...option, id: index + 1 })),
        }));
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`option_${indexToDelete}`];
            return newErrors;
        });
    };

    // =================== Submit Handler ===================
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!validateForm()) {
            snackbarEmitter("Please fill all required fields", "error");
            return;
        }

        setLoading(true);
        // const isUpdate = editQuestion;
        const updatePayload = {
            testQuestionId: editQuestion?._id,
            question: formData.question,
            options: formData.options,
            explanation: formData.explanation
        }
        const payload = editQuestion ? updatePayload : formData;
        console.log("payload", payload);

        try {
            const endpoint = editQuestion ? "/updateTestQuestion" : "/uploadTestQuestion";
            console.log("endpoint", endpoint);


            const response = await apiPost(endpoint, payload);
            if (response.data.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    snackbarEmitter(response.data.message, "success");
                    setFormData((prev) => ({
                        syllabusId: "",
                        bookId: "",
                        chapterId: "",
                        question: "",
                        options: [
                            { id: 1, text: "", isCorrect: false },
                            { id: 2, text: "", isCorrect: false },
                        ],
                        explanation: "",
                    }));
                    setErrors({});
                }, 500);
            } else {
                setLoading(false);
                console.error("Submission failed with response:", response);
                snackbarEmitter(response.data.message, "error");
            }
        } catch (error) {
            setLoading(false);
            console.error("Submission error:", error);
            snackbarEmitter("Something went wrong", "error");
        }
    };

    const handleCancel = () => {
        setFormData({
            question: "",
            options: [
                { id: 1, text: "", isCorrect: false },
                { id: 2, text: "", isCorrect: false },
            ],
            explanation: "",
            syllabusId: formData.syllabusId, // Preserving test info
            bookId: formData.bookId,
            testId: formData.testId,
        });
        setErrors({});
        setOptions([1, 2]);
    };



    //bulk upload

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleOpenUploadDialog = () => setUploadDialogOpen(true);
    const handleCloseUploadDialog = () => {
        setUploadDialogOpen(false);
        setSelectedFile(null);
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const [bulkLoad, setBulkLoad] = useState(false);

    const handleUpload = async () => {
        if (!selectedFile) {
            snackbarEmitter('File not selected', 'warning');
            return;
        }

        setBulkLoad(true);

        try {

            const reqData = new FormData();
            reqData.append('file', selectedFile);
            reqData.append('syllabusId', formData.syllabusId);
            reqData.append('bookId', formData.bookId);
            reqData.append('testId', formData.testId);

            const response = await apiPostUpload('/uploadTestQuestionsBulk', reqData);

            setTimeout(() => {
                setBulkLoad(false);
                if (response.data.status === 200) {
                    snackbarEmitter(response.data.message, 'success');
                    handleCloseUploadDialog();
                }
                else {
                    snackbarEmitter(response.data.message, 'error');
                    handleCloseUploadDialog();
                }

            }, 500);

        } catch (error) {

            snackbarEmitter('Something went wrong', 'error');
        }

    };

    const styles = {
        addImageBox: { display: "flex", justifyContent: "flex-end" },
        addImageButton: {
            backgroundColor: "#EAB308",
            color: "white",
            borderRadius: "10px",
            whiteSpace: "nowrap",
            textTransform: "none",
            fontFamily: "Lexend",
            fontWeight: 300,
            fontSize: "16px",
        },
        questionAreaGrid: { mt: 2, mb: 2 },
        divider: { border: "1px solid #DBDBDB", mb: 2 },
        dividerWithMargin: { border: "1px solid #DBDBDB", mb: 2, mt: 2 },
        optionsHeaderBox: {
            justifyContent: "space-between",
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
        },
        addOptionBox: { width: { xs: "100%", sm: "auto" } },
        addOptionButton: {
            backgroundColor: "#EAB308",
            color: "white",
            borderRadius: "10px",
            whiteSpace: "nowrap",
            textTransform: "none",
            fontFamily: "Lexend",
            fontWeight: 300,
            fontSize: "16px",
        },
        radioFormControl: { mt: 2 },
        optionItemBox: {
            display: "flex",
            width: "100%",
            alignItems: "center",
            mb: 2,
        },
        radio: {
            mt: 2,
            mr: { xs: -2, md: 2 },
            "&.Mui-checked": {
                color: "#EAB308",
            },
        },
        textAreaWrapper: {
            width: "-webkit-fill-available",
            marginLeft: { xs: "20px", md: "100px" },
        },
        deleteButtonBox: {
            display: "flex",
            justifyContent: "flex-end",
            mb: 1,
        },
        deleteButton: {
            padding: 0,
            minWidth: "auto",
            fontWeight: 500,
            textTransform: "none",
            fontFamily: "Jost",
            fontSize: "14px",
        },
        errorText: { color: "#d32f2f", fontSize: "0.75rem", mt: 1 },
        solutionBox: { display: "flex", width: "100%", alignItems: "center" },
        solutionTextArea: {
            width: "-webkit-fill-available",
            marginLeft: { xs: "10px", md: "100px" },
        },
        buttonGroup: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 4,
        },
        submitButton: {
            px: { xs: 2, sm: 4 },
            width: { xs: "60%", sm: "auto" },
            textTransform: "none",
            backgroundColor: "#EAB308",
            color: "white",
            borderRadius: "10px",
            whiteSpace: "nowrap",
            fontFamily: "Lexend",
            fontWeight: 300,
            fontSize: "16px",
        },
        cancelButton: {
            color: "#fff",
            backgroundColor: "#BF0000",
            borderRadius: "10px",
            px: { xs: 2, sm: 4 },
            textTransform: "none",
            whiteSpace: "nowrap",
            fontFamily: "Lexend",
            fontWeight: 300,
            fontSize: "16px",
        },
    };


    return (
        <Navbar title="Test">
            <Grid container spacing={2} sx={styles.questionAreaGrid}>
                <Grid size={{ xs: 12, md: 12, sm: 12 }} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                    <CustomTypography text="Question" />
                    {
                        !editQuestion &&
                        <CustomButton children='Bulk upload' onClick={handleOpenUploadDialog} loading={false} bgColor='#EAB308' sx={{ width: { xs: '40%', md: '15%', sm: '20%' }, fontSize: { xs: '10px', md: '14px', sm: '14px' } }} />
                    }


                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>

                    <CustomTextArea value={formData.question} onChange={(e) => handleInputChange({ target: { name: "question", value: e.target.value } })} error={!!errors.question} helperText={errors.question} />
                </Grid>


            </Grid>
            <Divider sx={styles.divider} />
            <Box sx={styles.optionsHeaderBox}>
                <CustomTypography text="Select Correct Option" />
                <CustomTypography text="Choices" />
                <Box sx={styles.addOptionBox}>
                    <Button onClick={handleAddOption} variant="contained" fullWidth sx={styles.addOptionButton} > +Add Option</Button>
                </Box>
            </Box>
            <FormControl fullWidth sx={styles.radioFormControl} error={!!errors.correct}>
                <RadioGroup onChange={(e) => handleOptionCorrectChange(e.target.value)}>
                    {formData.options.map((option, index) => (
                        <Box key={option.id} sx={styles.optionItemBox}>
                            <Radio value={`option-${index}`} checked={option.isCorrect} sx={styles.radio} />
                            <Box sx={styles.textAreaWrapper}>
                                <Box sx={styles.deleteButtonBox}>
                                    <Button variant="text" color="primary" onClick={() => handleDeleteOption(index)} sx={styles.deleteButton}>Delete</Button>
                                </Box>
                                <CustomTextArea value={option.text} onChange={(e) => handleOptionTextChange(index, e.target.value)} error={!!errors[`option_${index}`]} helperText={errors[`option_${index}`]} />
                            </Box>
                        </Box>
                    ))}
                </RadioGroup>
                {!!errors.correct && <Box sx={styles.errorText}>{errors.correct}</Box>}
            </FormControl>
            <Divider sx={styles.dividerWithMargin} />
            <Box sx={styles.solutionBox}>
                <CustomTypography text="Solution" />
                <Box sx={styles.solutionTextArea}>
                    <CustomTextArea value={formData.explanation} onChange={(e) => handleExplanationChange(e.target.value)} error={!!errors.explanation} helperText={errors.explanation} />
                </Box>
            </Box>
            <Box sx={styles.buttonGroup}>
                <CustomButton onClick={handleSubmit} loading={loading} bgColor="#EAB308" borderRadius="10px" sx={styles.submitButton}>
                    {editQuestion ? "Update Question" : "Add Question"}
                </CustomButton>
                <Button variant="outlined" onClick={handleCancel} sx={styles.cancelButton}>
                    Cancel
                </Button>
            </Box>



            <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Choose a file to upload questions in bulk.
                    </Typography>
                    <Button
                        component="label"
                        variant="contained"
                        sx={{ mt: 1, p: 1, backgroundColor: '#EAB308', color: 'white' }}
                        startIcon={<CloudUploadIcon />}

                    >
                        <input
                            type="file"
                            hidden
                            accept=".json"
                            onChange={handleFileSelect}
                        />
                    </Button>
                    {selectedFile && (
                        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            {selectedFile.name}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    {/* <Button
                              variant="contained"
                              sx={{ backgroundColor: 'orange', color: 'white' }}
                              onClick={handleUpload}
                          >
                              Upload
                          </Button> */}
                    <CustomButton children='Upload' onClick={handleUpload} loading={bulkLoad} bgColor='#EAB308' sx={{ width: { xs: '90%', md: '50%', sm: '60%' }, fontSize: { xs: '12px', md: '14px', sm: '14px' } }} />
                    {/* <Button onClick={handleCloseUploadDialog} >
                              Cancel
                          </Button> */}
                    <CustomButton children='Cancel' onClick={handleCloseUploadDialog} loading={false} bgColor='#CB1D02' sx={{ width: { xs: '90%', md: '50%', sm: '60%' }, fontSize: { xs: '12px', md: '14px', sm: '14px' } }} />
                </DialogActions>
            </Dialog>
        </Navbar>
    );
}

export default AddTestQuestion;